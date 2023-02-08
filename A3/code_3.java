// java -cp ./mysql-connector-j-8.0.32.jar code_3.java
import java.sql.*;
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
            
            String[] table_create=new String[]{
                "CREATE TABLE Physician( EmployeeID int NOT NULL, Name varchar(50), Position varchar(50), SSN int, PRIMARY KEY(EmployeeID));",
                "CREATE TABLE Department(DepartmentID int not NULL,Name varchar(50),Head int not NULL,PRIMARY KEY(DepartmentID),FOREIGN KEY(Head) REFERENCES Physician(EmployeeID));",
                "CREATE TABLE Affiliated_With(Physician int NOT NULL,Department int NOT NULL,PrimaryAffiliation BOOLEAN,CONSTRAINT pk PRIMARY KEY(Physician, Department),FOREIGN KEY(Physician) REFERENCES Physician(EmployeeID),FOREIGN KEY(Department) REFERENCES Department(DepartmentID));",
                "CREATE TABLE `Procedure`(Code int NOT NULL,Name VARCHAR(50),Cost int,PRIMARY KEY(Code));",
                "CREATE TABLE Patient(SSN int not NULL,Name varchar(50),Address varchar(200),Phone char(10),InsuaranceID int,PCP int NOT NULL,PRIMARY KEY(SSN),FOREIGN KEY(PCP) REFERENCES Physician(EmployeeID));",
                "CREATE TABLE Nurse(EmployeeID INT NOT NULL,Name VARCHAR(50),Position VARCHAR(50),Registered BOOLEAN,SSN INT,PRIMARY KEY(EmployeeID));",
                "CREATE TABLE Appointment(AppointmentID INT NOT NULL,Patient INT NOT NULL,PrepNurse INT,Physician INT NOT NULL,Start TIMESTAMP,End TIMESTAMP,ExaminationRoom varchar(10),PRIMARY KEY(AppointmentID),FOREIGN KEY(Patient) REFERENCES Patient(SSN),FOREIGN KEY(PrepNurse) REFERENCES Nurse(EmployeeID),FOREIGN KEY(Physician) REFERENCES Physician(EmployeeID));",
                "CREATE TABLE Medication(Code INT NOT NULL,Name varchar(50),Brand varchar(50),Description VARCHAR(50),PRIMARY KEY(Code));",
                "CREATE TABLE Prescribes(Physician INT NOT NULL,Patient INT NOT NULL,Medication INT NOT NULL,Date TIMESTAMP NOT NULL,Appointment INT,Dose varchar(50),CONSTRAINT pk PRIMARY KEY(Physician, Patient, Medication, Date),FOREIGN KEY(Physician) REFERENCES Physician(EmployeeID),FOREIGN KEY(Patient) REFERENCES Patient(SSN),FOREIGN KEY(Medication) REFERENCES Medication(Code),FOREIGN KEY(Appointment) REFERENCES Appointment(AppointmentID));",
                "CREATE TABLE `Block`(`Floor` INT NOT NULL,Code INT NOT NULL,CONSTRAINT pk PRIMARY KEY(`Floor`, Code));",
                "CREATE TABLE Room(`Number` INT NOT NULL,`Type` varchar(50),BlockFloor INT NOT NULL,BlockCode INT NOT NULL,Unavailable BOOLEAN,CONSTRAINT PRIMARY KEY(`Number`));",
                "CREATE TABLE On_Call(Nurse INT NOT NULL,BlockFloor INT NOT NULL,BlockCode INT NOT NULL,`Start` TIMESTAMP,`End` TIMESTAMP,CONSTRAINT pk PRIMARY KEY(Nurse, BlockFloor, BlockCode, `Start`, `End`));",
                "CREATE TABLE Stay(StayID INT NOT NULL,Patient INT NOT NULL,Room INT NOT NULL,`Start` TIMESTAMP,`End` TIMESTAMP,PRIMARY KEY(StayID),FOREIGN KEY(Patient) REFERENCES Patient(SSN),FOREIGN KEY(Room) REFERENCES Room(Number));",
                "CREATE TABLE Undergoes(Patient INT NOT NULL,`Procedure` INT NOT NULL,Stay INT NOT NULL,`Date` TIMESTAMP,Physician INT NOT NULL,AssistingNurse INT,CONSTRAINT pk PRIMARY KEY(Patient, `Procedure`, Stay, `Date`),FOREIGN KEY(Patient) REFERENCES Patient(SSN),FOREIGN KEY(`Procedure`) REFERENCES `Procedure`(Code),FOREIGN KEY(Stay) REFERENCES Stay(StayID),FOREIGN KEY(Physician) REFERENCES Physician(EmployeeID),FOREIGN KEY(AssistingNurse) REFERENCES Nurse(EmployeeID));",
                "CREATE TABLE Trained_In(Physician INT NOT NULL,Treatment INT NOT NULL,CertificationDate TIMESTAMP,CertificationExpires TIMESTAMP,CONSTRAINT pk PRIMARY KEY(Physician, Treatment),FOREIGN KEY(Physician) REFERENCES Physician(EmployeeID),FOREIGN KEY(Treatment) REFERENCES `Procedure`(Code));"
            };
            for(int i=0; i<15; i++){
                try {
                    stmt = conn.createStatement();
                    stmt.executeUpdate(table_create[i]);
                    System.out.println("Table created successfully...");
                } catch (SQLException se) {
                    se.printStackTrace();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            

            String[] table_fill=new String[]{
                "INSERT INTO Physician VALUES(1,'Alan Donald','Intern',111111111);",
                "INSERT INTO Physician VALUES(2,'Bruce Reid','Attending Physician',222222222);",
                "INSERT INTO Physician VALUES(3,'Courtney Walsh','Surgeon Physician',333333333);",
                "INSERT INTO Physician VALUES(4,'Malcom Marshall','Senior Physician',444444444);",
                "INSERT INTO Physician VALUES(5,'Dennis Lillee','Head Chief of Medicine',555555555);",
                "INSERT INTO Physician VALUES(6,'Jeff Thomson','Surgeon Physician',666666666);",
                "INSERT INTO Physician VALUES(7,'Richard Hadlee','Surgeon Physician',777777777);",
                "INSERT INTO Physician VALUES(8,'Kapil  Dev','Resident',888888888);",
                "INSERT INTO Physician VALUES(9,'Ishant Sharma','Psychiatrist',999999999);",
                "INSERT INTO Department VALUES(1,'medicine',4);",
                "INSERT INTO Department VALUES(2,'surgery',7);",
                "INSERT INTO Department VALUES(3,'psychiatry',9);",
                "INSERT INTO Department VALUES(4,'cardiology',8);",
                "INSERT INTO Affiliated_With VALUES(1,1,1);",
                "INSERT INTO Affiliated_With VALUES(2,1,1);",
                "INSERT INTO Affiliated_With VALUES(3,1,0);",
                "INSERT INTO Affiliated_With VALUES(3,2,1);",
                "INSERT INTO Affiliated_With VALUES(4,1,1);",
                "INSERT INTO Affiliated_With VALUES(5,1,1);",
                "INSERT INTO Affiliated_With VALUES(6,2,1);",
                "INSERT INTO Affiliated_With VALUES(7,1,0);",
                "INSERT INTO Affiliated_With VALUES(7,2,1);",
                "INSERT INTO Affiliated_With VALUES(8,1,1);",
                "INSERT INTO Affiliated_With VALUES(9,3,1);",
                "INSERT INTO `Procedure` VALUES(1,'bypass surgery',1500.0);",
                "INSERT INTO `Procedure` VALUES(2,'angioplasty',3750.0);",
                "INSERT INTO `Procedure` VALUES(3,'arthoscopy',4500.0);",
                "INSERT INTO `Procedure` VALUES(4,'carotid endarterectomy',10000.0);",
                "INSERT INTO `Procedure` VALUES(5,'cholecystectomy',4899.0);",
                "INSERT INTO `Procedure` VALUES(6,'tonsillectomy',5600.0);",
                "INSERT INTO `Procedure` VALUES(7,'cataract surgery',25.0);",
                "INSERT INTO Patient VALUES(100000001,'Dilip Vengsarkar','42 Foobar Lane','555-0256',68476213,1);",
                "INSERT INTO Patient VALUES(100000002,'Richie Richardson','37 Infinite Loop','555-0512',36546321,2);",
                "INSERT INTO Patient VALUES(100000003,'Mark Waugh','101 Parkway Street','555-1204',65465421,2);",
                "INSERT INTO Patient VALUES(100000004,'Ramiz Raza','1100 Sparks Avenue','555-2048',68421879,3);",
                "INSERT INTO Nurse VALUES(101,'Eknath Solkar','Head Nurse',1,111111110);",
                "INSERT INTO Nurse VALUES(102,'David Boon','Nurse',1,222222220);",
                "INSERT INTO Nurse VALUES(103,'Andy Flowers','Nurse',0,333333330);",
                "INSERT INTO Appointment VALUES(13216584,100000001,101,1,'2018-04-24 10:00','2018-04-24 11:00','A');",
                "INSERT INTO Appointment VALUES(26548913,100000002,101,2,'2018-04-24 10:00','2018-04-24 11:00','B');",
                "INSERT INTO Appointment VALUES(36549879,100000001,102,1,'2018-04-25 10:00','2018-04-25 11:00','A');",
                "INSERT INTO Appointment VALUES(46846589,100000004,103,4,'2018-04-25 10:00','2018-04-25 11:00','B');",
                "INSERT INTO Appointment VALUES(59871321,100000004,NULL,4,'2018-04-26 10:00','2018-04-26 11:00','C');",
                "INSERT INTO Appointment VALUES(69879231,100000003,103,2,'2018-04-26 11:00','2018-04-26 12:00','C');",
                "INSERT INTO Appointment VALUES(76983231,100000001,NULL,3,'2018-04-26 12:00','2018-04-26 13:00','C');",
                "INSERT INTO Appointment VALUES(86213939,100000004,102,9,'2018-04-27 10:00','2018-04-21 11:00','A');",
                "INSERT INTO Appointment VALUES(93216548,100000002,101,2,'2018-04-27 10:00','2018-04-27 11:00','B');",
                "INSERT INTO Medication VALUES(1,'Paracetamol','Z','N/A');",
                "INSERT INTO Medication VALUES(2,'Actemra','Foolki Labs','N/A');",
                "INSERT INTO Medication VALUES(3,'Molnupiravir','Bale Laboratories','N/A');",
                "INSERT INTO Medication VALUES(4,'Paxlovid','Bar Industries','N/A');",
                "INSERT INTO Medication VALUES(5,'Remdesivir','Donald Pharmaceuticals','N/A');",
                "INSERT INTO Prescribes VALUES(1,100000001,1,'2018-04-24 10:47',13216584,'5');",
                "INSERT INTO Prescribes VALUES(9,100000004,2,'2018-04-27 10:53',86213939,'10');",
                "INSERT INTO Prescribes VALUES(9,100000004,2,'2018-04-30 16:53',NULL,'5');",
                "INSERT INTO `Block` VALUES(1,1);",
                "INSERT INTO `Block` VALUES(1,2);",
                "INSERT INTO `Block` VALUES(1,3);",
                "INSERT INTO `Block` VALUES(2,1);",
                "INSERT INTO `Block` VALUES(2,2);",
                "INSERT INTO `Block` VALUES(2,3);",
                "INSERT INTO `Block` VALUES(3,1);",
                "INSERT INTO `Block` VALUES(3,2);",
                "INSERT INTO `Block` VALUES(3,3);",
                "INSERT INTO `Block` VALUES(4,1);",
                "INSERT INTO `Block` VALUES(4,2);",
                "INSERT INTO `Block` VALUES(4,3);",
                "INSERT INTO Room VALUES(101,'Single',1,1,0);",
                "INSERT INTO Room VALUES(102,'Single',1,1,0);",
                "INSERT INTO Room VALUES(103,'Single',1,1,0);",
                "INSERT INTO Room VALUES(111,'Single',1,2,0);",
                "INSERT INTO Room VALUES(112,'Single',1,2,1);",
                "INSERT INTO Room VALUES(113,'Single',1,2,0);",
                "INSERT INTO Room VALUES(121,'Single',1,3,0);",
                "INSERT INTO Room VALUES(122,'Single',1,3,0);",
                "INSERT INTO Room VALUES(123,'Single',1,3,0);",
                "INSERT INTO Room VALUES(201,'Single',2,1,1);",
                "INSERT INTO Room VALUES(202,'Single',2,1,0);",
                "INSERT INTO Room VALUES(203,'Single',2,1,0);",
                "INSERT INTO Room VALUES(211,'Single',2,2,0);",
                "INSERT INTO Room VALUES(212,'Single',2,2,0);",
                "INSERT INTO Room VALUES(213,'Single',2,2,1);",
                "INSERT INTO Room VALUES(221,'Single',2,3,0);",
                "INSERT INTO Room VALUES(222,'Single',2,3,0);",
                "INSERT INTO Room VALUES(223,'Single',2,3,0);",
                "INSERT INTO Room VALUES(301,'Single',3,1,0);",
                "INSERT INTO Room VALUES(302,'Single',3,1,1);",
                "INSERT INTO Room VALUES(303,'Single',3,1,0);",
                "INSERT INTO Room VALUES(311,'Single',3,2,0);",
                "INSERT INTO Room VALUES(312,'Single',3,2,0);",
                "INSERT INTO Room VALUES(313,'Single',3,2,0);",
                "INSERT INTO Room VALUES(321,'Single',3,3,1);",
                "INSERT INTO Room VALUES(322,'Single',3,3,0);",
                "INSERT INTO Room VALUES(323,'Single',3,3,0);",
                "INSERT INTO Room VALUES(401,'Single',4,1,0);",
                "INSERT INTO Room VALUES(402,'Single',4,1,1);",
                "INSERT INTO Room VALUES(403,'Single',4,1,0);",
                "INSERT INTO Room VALUES(411,'Single',4,2,0);",
                "INSERT INTO Room VALUES(412,'Single',4,2,0);",
                "INSERT INTO Room VALUES(413,'Single',4,2,0);",
                "INSERT INTO Room VALUES(421,'Single',4,3,1);",
                "INSERT INTO Room VALUES(422,'Single',4,3,0);",
                "INSERT INTO Room VALUES(423,'Single',4,3,0);",
                "INSERT INTO On_Call VALUES(101,1,1,'2018-11-04 11:00','2018-11-04 19:00');",
                "INSERT INTO On_Call VALUES(101,1,2,'2018-11-04 11:00','2018-11-04 19:00');",
                "INSERT INTO On_Call VALUES(102,1,3,'2018-11-04 11:00','2018-11-04 19:00');",
                "INSERT INTO On_Call VALUES(103,1,1,'2018-11-04 19:00','2018-11-05 03:00');",
                "INSERT INTO On_Call VALUES(103,1,2,'2018-11-04 19:00','2018-11-05 03:00');",
                "INSERT INTO On_Call VALUES(103,1,3,'2018-11-04 19:00','2018-11-05 03:00');",
                "INSERT INTO Stay VALUES(3215,100000001,111,'2018-05-01','2018-05-04');",
                "INSERT INTO Stay VALUES(3216,100000003,123,'2018-05-03','2018-05-14');",
                "INSERT INTO Stay VALUES(3217,100000004,112,'2018-05-02','2018-05-03');",
                "INSERT INTO Undergoes VALUES(100000001,6,3215,'2018-05-02',3,101);",
                "INSERT INTO Undergoes VALUES(100000001,2,3215,'2018-05-03',7,101);",
                "INSERT INTO Undergoes VALUES(100000004,1,3217,'2018-05-07',3,102);",
                "INSERT INTO Undergoes VALUES(100000004,5,3217,'2018-05-09',6,NULL);",
                "INSERT INTO Undergoes VALUES(100000001,7,3217,'2018-05-10',7,101);",
                "INSERT INTO Undergoes VALUES(100000004,4,3217,'2018-05-13',3,103);",
                "INSERT INTO Trained_In VALUES(3,1,'2018-01-01','2018-12-31');",
                "INSERT INTO Trained_In VALUES(3,2,'2018-01-01','2018-12-31');",
                "INSERT INTO Trained_In VALUES(3,5,'2018-01-01','2018-12-31');",
                "INSERT INTO Trained_In VALUES(3,6,'2018-01-01','2018-12-31');",
                "INSERT INTO Trained_In VALUES(3,7,'2018-01-01','2018-12-31');",
                "INSERT INTO Trained_In VALUES(6,2,'2018-01-01','2018-12-31');",
                "INSERT INTO Trained_In VALUES(6,5,'2017-01-01','2017-12-31');",
                "INSERT INTO Trained_In VALUES(6,6,'2018-01-01','2018-12-31');",
                "INSERT INTO Trained_In VALUES(7,1,'2018-01-01','2018-12-31');",
                "INSERT INTO Trained_In VALUES(7,2,'2018-01-01','2018-12-31');",
                "INSERT INTO Trained_In VALUES(7,3,'2018-01-01','2018-12-31');",
                "INSERT INTO Trained_In VALUES(7,4,'2018-01-01','2018-12-31');",
                "INSERT INTO Trained_In VALUES(7,5,'2018-01-01','2018-12-31');",
                "INSERT INTO Trained_In VALUES(7,6,'2018-01-01','2018-12-31');",
                "INSERT INTO Trained_In VALUES(7,7,'2018-01-01','2018-12-31');"
            };
            for(int i=0; i<133; i++){
                try {
                    stmt = conn.createStatement();
                    stmt.executeUpdate(table_fill[i]);
                } catch (SQLException se) {
                    se.printStackTrace();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        String[] Q=new String[]{
            "SELECT `Name` FROM Physician WHERE EmployeeID IN (SELECT Physician FROM Trained_In WHERE Treatment IN (    SELECT Code    FROM `Procedure`    WHERE `Name`='bypass surgery'));",
            "SELECT `Name`  FROM Physician  WHERE EmployeeID IN ( SELECT Physician FROM Trained_In WHERE Treatment IN ( SELECT Code FROM `Procedure` WHERE `Name`='bypass surgery' ) ) AND EmployeeID IN ( SELECT Physician FROM Affiliated_With WHERE Department IN ( SELECT DepartmentID FROM Department Where `Name`='cardiolody' ) );",
            "SELECT Nurse.`Name`  FROM Nurse WHERE EmployeeID IN ( SELECT Nurse  FROM On_Call, Room WHERE On_Call.BlockFloor = Room.BlockFloor AND On_Call.BlockCode = Room.BlockCode AND Room.Number = 123 );",
            "SELECT `Name`,`Address` FROM Patient WHERE SSN IN ( SELECT Patient  FROM Prescribes JOIN Medication ON Prescribes.Medication = Medication.Code WHERE Medication.Name = 'Remdesivir' );",
            "SELECT `Name`, InsuaranceID FROM Patient WHERE SSN IN ( SELECT Patient FROM Stay JOIN Room  ON Stay.Room = Room.Number WHERE Room.`Type`='icu' AND TIMESTAMPDIFF(DAY, Stay.Start, Stay.End)>15 );",
            "SELECT `Name` FROM Nurse WHERE EmployeeID IN ( SELECT Undergoes.AssistingNurse FROM Undergoes JOIN `Procedure` ON Undergoes.`Procedure` = `Procedure`.Code WHERE `Procedure`.`Name`='bypass surgery' );",
            "SELECT Nurse.`Name`, Nurse.Position, Physician.`Name` FROM Nurse, Physician WHERE (Nurse.EmployeeID, Physician.EmployeeID) IN ( SELECT Undergoes.AssistingNurse, Undergoes.Physician FROM Undergoes JOIN `Procedure` ON Undergoes.`Procedure` = `Procedure`.Code WHERE `Procedure`.`Name`='bypass surgery' );",
            "SELECT `Name` as 'Physician Name' FROM Physician WHERE EmployeeID IN ( SELECT Undergoes.Physician FROM Undergoes WHERE (Undergoes.Physician, Undergoes.`Procedure`) NOT IN( SELECT Physician, Treatment FROM Trained_In ) );",
            "SELECT `Name` as 'Physician Name' FROM Physician WHERE EmployeeID IN ( SELECT Undergoes.Physician FROM Undergoes WHERE (Undergoes.Physician, Undergoes.`Procedure`) IN( SELECT Physician, Treatment FROM Trained_In WHERE TIMESTAMPDIFF(SECOND, Trained_In.CertificationExpires, Undergoes.Date)>0 ) );",
            "SELECT  Physician.Name AS 'Physician',  `Procedure`.`Name` AS Treatment,  Undergoes.`Date`,  Patient.Name AS 'Patient' FROM  Physician, `Procedure`, Undergoes, Patient WHERE (Undergoes.Physician, Undergoes.`Procedure`) IN( SELECT Physician, Treatment FROM Trained_In WHERE TIMESTAMPDIFF(SECOND, Trained_In.CertificationExpires, Undergoes.Date)>0 ) AND Physician.EmployeeID=Undergoes.Physician AND `Procedure`.Code=Undergoes.`Procedure` AND Patient.SSN=Undergoes.Patient ;",
            "SELECT Patient.`Name` as 'Patient', Physician.`Name` as 'Physician' FROM Patient JOIN Physician WHERE (Patient.SSN, Physician.EmployeeID) IN ( SELECT Patient, Physician FROM Prescribes WHERE Medication IS NOT NULL ) AND Patient.SSN IN ( SELECT Patient FROM Undergoes JOIN `Procedure` ON Undergoes.`Procedure`=`Procedure`.Code WHERE `Procedure`.Cost>5000  ) AND Patient.SSN IN ( SELECT Patient  FROM ( SELECT Patient, COUNT(*) as cnt FROM ( SELECT Patient FROM Appointment WHERE Physician IN ( SELECT Physician FROM Affiliated_With WHERE Department='cardiology' ) ) AS sq0 GROUP BY Patient ) as SQ1 WHERE cnt>=2 ) AND Physician.EmployeeID IN ( SELECT EmployeeID FROM Physician WHERE EmployeeID NOT IN( SELECT Head FROM Department ) ) ;",
            "SELECT Medication.`Name`, Medication.Brand, COUNT(Prescribes.Patient) AS Qty FROM Medication, Prescribes WHERE Medication.Code = Prescribes.Medication GROUP BY Medication.Code ORDER BY Qty DESC LIMIT 1;"
        };
        
        Scanner scn = new Scanner(System.in);
        System.out.println("Note: Enter 0 to terminate.");
        while(true){
            System.out.print("Enter Query No:");
            // int x = scn.nextInt();
            int x = Integer.parseInt(System.console().readLine());
            if(x==0)
                break;
            String cmd;
            if(x==13){
                System.out.print("Enter Procedure Type: ");
                String proc = scn.nextLine();
                cmd = "SELECT `Name` FROM Physician WHERE EmployeeID IN (SELECT Physician FROM Trained_In WHERE Treatment IN (    SELECT Code    FROM `Procedure`    WHERE `Name`='"+proc+"'));";
                // System.out.println(cmd);
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
                        System.out.print(rs.getString(i) + "\t");
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

        try {
            if (conn != null && !conn.isClosed()) {
                conn.close();
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
    }
}
