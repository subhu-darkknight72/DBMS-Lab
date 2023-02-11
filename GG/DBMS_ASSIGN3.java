
// java -cp ./mysql-connector-j-8.0.32.jar DBMS_ASSIGN3.java
import java.sql.*;
import java.io.*;
import java.util.*;

class DBMS_ASSIGN3 {
    public static void main(String args[]) {
        Connection con = null;
        try {
            // String url = "jdbc:mysql://localhost/gg";
            // String user = "root";
            // String password = "";
            // con = DriverManager.getConnection(url, user, password);

            con = DriverManager.getConnection("jdbc:mysql://localhost/gg", "root", "");
            System.out.print("GG -1");
        
            String fileName = "create_20CS30019.txt"; // will have to ensure the file is in the same directory
            Statement stmt = null;

            System.out.print("Want to create and insert?(0/1):");
            Scanner sc = new Scanner(System.in);
            int ch = Integer.parseInt(System.console().readLine());
            if (ch == 1) {
                BufferedReader reader = new BufferedReader(new FileReader(fileName));
                String line;
                while ((line = reader.readLine()) != null) {
                    stmt = con.createStatement();
                    stmt.executeUpdate(line);
                }
                reader.close();
            }
            ch = 1;
            String[] Queries = new String[] {
                "SELECT Name FROM Physician WHERE EmployeeID in(SELECT Physician FROM Trained_in WHERE Treatment in (SELECT Code FROM Procedure1 WHERE Name='bypass surgery'))",
                "SELECT Name FROM Physician WHERE EmployeeID in(SELECT Physician FROM Trained_in WHERE Treatment in(SELECT Code FROM Procedure1 WHERE Name='bypass surgery')) and EmployeeID in (SELECT Physician FROM Affiliated_with WHERE Department in (SELECT DepartmentID FROM Department WHERE Name='cardiology'));",
                "SELECT Name FROM Nurse WHERE EmployeeID in (SELECT On_Call.Nurse FROM On_Call INNER JOIN Room ON Room.BlockCode=On_Call.BlockCode AND Room.BlockFloor=On_Call.BlockFloor WHERE Room.Number='123')",
                "SELECT Name, Address FROM Patient WHERE SSN in (SELECT Patient FROM Prescribes WHERE Medication in (SELECT Code FROM Medication WHERE Name='remdesivir'));",
                "SELECT Name, InsuranceID FROM Patient WHERE SSN in (WITH New AS (SELECT Patient, DATEDIFF(End,Start) as DIFF FROM Stay) SELECT Patient FROM New WHERE DIFF>15) AND SSN in (SELECT Patient FROM Stay WHERE Room in (SELECT Number FROM Room WHERE Type ='icu'));",
                "SELECT Name FROM Nurse WHERE EmployeeID in (SELECT AssistingNurse FROM Undergoes WHERE Procedure1 in (SELECT Code FROM Procedure1 WHERE Name='bypass surgery'));",
                "WITH New AS (SELECT Nurse.Name, Nurse.Position, Undergoes.Physician FROM Undergoes INNER JOIN Nurse ON Nurse.EmployeeID=Undergoes.AssistingNurse WHERE Undergoes.Procedure1 in (SELECT Code FROM Procedure1 WHERE Name='bypass surgery') ) SELECT New.Name AS Nurse_Name, New.Position AS Nurse_Position, Physician.Name AS Physician_Name FROM New INNER JOIN Physician ON Physician.EmployeeID=New.Physician;",
                "SELECT Name FROM Physician WHERE EmployeeID IN (WITH New AS(SELECT DISTINCT Physician.EmployeeID AS Physician_ID FROM Physician,Undergoes WHERE Physician.EmployeeID = Undergoes.Physician AND Undergoes.Procedure1 NOT IN (SELECT Trained_in.Treatment AS Treatment FROM Physician,Trained_in WHERE Physician.EmployeeID = Trained_in.Physician AND Undergoes.Physician=Trained_in.Physician)) SELECT Physician_ID FROM New)",
                "SELECT Name FROM Physician WHERE EmployeeID in (SELECT Undergoes.Physician FROM Undergoes INNER JOIN Trained_in ON Undergoes.Physician=Trained_in.Physician WHERE Trained_in.Treatment=Undergoes.Procedure1 AND Undergoes.Date > Trained_in.CertificationExpires);",
                "WITH New AS (WITH New AS(SELECT Undergoes.Physician AS Physician, Undergoes.Procedure1 AS Procedure1,Undergoes.Date AS Date FROM Undergoes INNER JOIN Trained_in ON Undergoes.Physician=Trained_in.Physician WHERE Trained_in.Treatment=Undergoes.Procedure1 AND Undergoes.Date > Trained_in.CertificationExpires) SELECT Physician.Name AS Physician_Name,New.Procedure1 AS Procedure1, New.Date AS Date FROM Physician INNER JOIN New WHERE Physician.EmployeeID=New.Physician)SELECT New.Physician_Name,Procedure1.Name AS Procedure_Name, New.Date FROM New INNER JOIN Procedure1 ON Procedure1.Code=New.Procedure1",
                "WITH New AS(WITH New AS (SELECT Prescribes.Patient AS Patient, Prescribes.Physician AS Physician FROM Prescribes INNER JOIN Undergoes ON Prescribes.Patient= Undergoes.Patient INNER JOIN Procedure1 ON Procedure1.Code=Undergoes.Procedure1 WHERE Procedure1.Cost>5000),Apnt_Table AS (WITH New AS(SELECT Appointment.Patient AS Patient, COUNT(*) AS Count_Patient FROM Appointment,Affiliated_with,Department WHERE Affiliated_with.Physician=Appointment.Physician AND Affiliated_with.Department=Department.DepartmentID AND Department.Name='cardiology' GROUP BY Appointment.Patient  ) SELECT Patient FROM New WHERE Count_Patient>1 )SELECT New.Patient AS Patient , New.Physician AS Physician FROM New INNER JOIN Apnt_Table ON New.Patient=Apnt_Table.Patient WHERE New.Physician  NOT IN (SELECT Physician.EmployeeID AS Physician FROM Physician INNER JOIN Department ON Department.Head=Physician.EmployeeID)) SELECT Patient.Name AS Patient_Name, Physician.Name AS Physician_Name FROM Patient INNER JOIN New ON New.Patient=Patient.SSN INNER JOIN Physician ON New.Physician=Physician.EmployeeID",
                "SELECT Name,Brand FROM Medication WHERE Code = (WITH New AS(SELECT Medication, COUNT(*) as Prescribes_New FROM Prescribes GROUP BY Medication)SELECT Medication FROM New WHERE Prescribes_New =(WITH New AS (SELECT Medication, COUNT(*) as Prescribes_New FROM Prescribes GROUP BY Medication ORDER BY Prescribes_New DESC LIMIT 1) SELECT Prescribes_New FROM New));"
            };
            Scanner sc1 = new Scanner(System.in);
            while (ch == 1) {
                System.out.print("Which query?:");
                ch = Integer.parseInt(System.console().readLine());
                String qry;
                if (ch == 13) {
                    System.out.print("Which procedure?:");
                    
                    String procedure = sc1.nextLine();
                    qry = "SELECT Name FROM Physician WHERE EmployeeID in(SELECT Physician FROM Trained_in WHERE Treatment in (SELECT Code FROM Procedure1 WHERE Name='"
                            + procedure + "'));";
            
                } else if (ch < 13 & ch > 0) {
                    qry = Queries[ch-1];
                } else {
                    System.out.print("Invalid choice!!");
                    System.out.print("Want to continue?(0/1):");
                    ch = Integer.parseInt(System.console().readLine());
                    continue;
                }
                stmt = con.createStatement();
                ResultSet result = stmt.executeQuery(qry);
                ResultSetMetaData cols = result.getMetaData();
                int n = cols.getColumnCount();

                System.out.println("--------------------");
                for (int i = 1; i <= n; i++) {
                    System.out.print(cols.getColumnName(i));
                    System.out.print("\t");
                }
                System.out.println();
                System.out.println("--------------------");
                while (result.next()) {
                    for (int i = 1; i <= n; i++) {
                        System.out.print(result.getString(i));
                        System.out.print("\t");
                    }
                    System.out.println();
                }
                System.out.println("--------------------");
                System.out.print("Want to continue?(0/1):");
                ch = Integer.parseInt(System.console().readLine());
            }

            sc.close();
            sc1.close();
            con.close();

        } catch (Exception e) {
            System.out.println(e);
        }
    }
}