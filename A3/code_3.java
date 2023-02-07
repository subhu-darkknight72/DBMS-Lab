
// java -cp ./mysql-connector-j-8.0.32.jar jdbc.java
import java.sql.*;
import java.io.*;
import java.util.*;

public class code_3 {
    public static void main(String[] args) {
        Connection conn = null;
        Statement stmt = null;
        
        try {
            // Connect to the database
            String url = "jdbc:mysql://localhost/A3_Java";
            String user = "root";
            String password = "";
            conn = DriverManager.getConnection(url, user, password);
            System.out.println("Connected to the database");

        } catch (SQLException ex) {
            System.out.println("Error: unable to connect to the database");
            ex.printStackTrace();
        }

        System.out.print("Do you want to create and fill with tables (y/n): ");
        Scanner scn0 = new Scanner(System.in);
        String str0 = scn0.next();

        if(str0.equals("Y") || str0.equals("y")){
            try {
                File file = new File("table_create.txt"); // creates a new file instance
                FileReader fr = new FileReader(file); // reads the file
                BufferedReader br = new BufferedReader(fr); // creates a buffering character input stream
                String line;
                while ((line = br.readLine()) != null) {
                    try {
                        stmt = conn.createStatement();
                        stmt.executeUpdate(line);
                        System.out.println("Table created successfully...");
                    } catch (SQLException se) {
                        se.printStackTrace();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                fr.close(); // closes the stream and release the resources
            } catch (IOException e) {
                e.printStackTrace();
            }

            try {
                File file = new File("table_fill.txt"); // creates a new file instance
                FileReader fr = new FileReader(file); // reads the file
                BufferedReader br = new BufferedReader(fr); // creates a buffering character input stream
                String line;
                while ((line = br.readLine()) != null) {
                    try {
                        stmt = conn.createStatement();
                        stmt.executeUpdate(line);
                    } catch (SQLException se) {
                        se.printStackTrace();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                System.out.println("Table filled successfully...");
                fr.close(); // closes the stream and release the resources
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        String[] Q=new String[13];
        try {
            File file = new File("query.txt"); // creates a new file instance
            FileReader fr = new FileReader(file); // reads the file
            BufferedReader br = new BufferedReader(fr); // creates a buffering character input stream
            String line;
            for (int i=0; (line = br.readLine()) != null; i++) {
                Q[i]=line;
            }
            fr.close(); // closes the stream and release the resources
        } catch (IOException e) {
            e.printStackTrace();
        }

        Scanner scn = new Scanner(System.in);
        System.out.println("Note: Enter 0 to terminate.");
        while(true){
            System.out.print("Enter Query No:");
            int x = scn.nextInt();
            if(x==0)
                break;
            String cmd;
            if(x==13){
                Scanner scn1 = new Scanner(System.in);
                System.out.print("Enter Procedure Type: ");
                String proc = scn1.nextLine();
                cmd = "SELECT `Name` FROM Physician WHERE EmployeeID IN (SELECT Physician FROM Trained_In WHERE Treatment IN (    SELECT Code    FROM `Procedure`    WHERE `Name`='"+proc+"'));";
                System.out.println(cmd);
                scn1.close();
            }
            else
                cmd = Q[x-1];

            try{
                stmt = conn.createStatement();
                ResultSet rs = stmt.executeQuery(cmd);
                ResultSetMetaData rsmd = rs.getMetaData();
                int columnCount = rsmd.getColumnCount();
            
                for (int i = 1; i <= columnCount; i++)
                    System.out.print(rsmd.getColumnName(i)+"\t\t");
                
                System.out.println();
                int cnt=0;
                while (rs.next()) {
                    for (int i = 1; i <= columnCount; i++)
                        System.out.print(rs.getString(i) + "\t\t");
                    System.out.println();
                    cnt++;
                }

                if(cnt==0){
                    for (int i = 1; i <= columnCount; i++)
                        System.out.print("NULL \t\t");
                    System.out.println();
                }
            }
            catch (SQLException se) {
                se.printStackTrace();
            }
        }
        scn0.close();
        scn.close();

        // try {
        //     stmt = conn.createStatement();
        //     String sql = "CREATE TABLE Physician( EmployeeID int NOT NULL, Name varchar(50), Position varchar(50), SSN int, PRIMARY KEY(EmployeeID))";
        //     stmt.executeUpdate(sql);
        //     System.out.println("Table created successfully...");
        // } catch (SQLException se) {
        //     // Handle errors for JDBC
        //     se.printStackTrace();
        // } catch (Exception e) {
        //     // Handle errors for Class.forName
        //     e.printStackTrace();
        // }

        try {
            if (conn != null && !conn.isClosed()) {
                conn.close();
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
    }
}
