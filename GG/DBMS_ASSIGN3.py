import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  database="GG"
)
ch=input("Do you want to create tables?(0/1):")
if ch==1 :
  schema=mydb.cursor()
  file1=open('create_20CS30019.txt','r')
  lines=file1.realines()
## create statements execute
  for line in lines:
    schema.execute(line.strip())
    mydb.commit()
  #ch=input("Do you want to create tables?(0/1):")

ch=1
while (ch==1) :
  choice=input("Enter the query number:")
  if choice==1 :
    schema.execute("SELECT Name FROM Physician WHERE EmployeeID in(SELECT Physician FROM Trained_in WHERE Treatment in (SELECT Code FROM Procedure1 WHERE Name='bypass surgery'))")
    output=schema.fetchall()
    for x in output:
      print(x)
  elif choice==5 :
    schema.execute("SELECT Name, InsuranceID FROM Patient WHERE SSN in (WITH New AS (SELECT Patient, DATEDIFF(End,Start) as DIFF FROM Stay) SELECT Patient FROM New WHERE DIFF>15) AND SSN in (SELECT Patient FROM Stay WHERE Room in (SELECT Number FROM Room WHERE Type ='icu'))")
    output=schema.fetchall()
    for x in output:
      print(x)
  elif choice==2 :
    schema.execute("SELECT Name FROM Physician WHERE EmployeeID in(SELECT Physician FROM Trained_in WHERE Treatment in(SELECT Code FROM Procedure1 WHERE Name='bypass surgery')) and EmployeeID in (SELECT Physician FROM Affiliated_with WHERE Department in (SELECT DepartmentID FROM Department WHERE Name='cardiology'))")
    output=schema.fetchall()
    for x in output:
      print(x)
  elif choice==3 :
    schema.execute("SELECT Name FROM Nurse WHERE EmployeeID in (SELECT On_Call.Nurse FROM On_Call INNER JOIN Room ON Room.BlockCode=On_Call.BlockCode AND Room.BlockFloor=On_Call.BlockFloorWHERE Room.Number='123')")
    output=schema.fetchall()
    for x in output:
      print(x)
  elif choice==4 :
    schema.execute("SELECT Name, Address FROM Patient WHERE SSN in (SELECT Patient FROM Prescribes WHERE Medication in (SELECT Code FROM Medication WHERE Name='remdesivir'))")
    output=schema.fetchall()
    for x in output:
      print(x)
  elif choice==6 :
    schema.execute("SELECT Name FROM Nurse WHERE EmployeeID in (SELECT AssistingNurse FROM Undergoes WHERE Procedure1 in (SELECT Code FROM Procedure1 WHERE Name='bypass surgery'))")
    output=schema.fetchall()
    for x in output:
      print(x)
  elif choice==7 :
    schema.execute("WITH New AS (SELECT Nurse.Name, Nurse.Position, Undergoes.Physician FROM Undergoes INNER JOIN Nurse ON Nurse.EmployeeID=Undergoes.AssistingNurse WHERE Undergoes.Procedure1 in (SELECT Code FROM Procedure1 WHERE Name='bypass surgery') ) SELECT New.Name AS Nurse_Name, New.Position AS Nurse_Position, Physician.Name AS Physician_Name FROM New INNER JOIN Physician ON Physician.EmployeeID=New.Physician")
    output=schema.fetchall()
    for x in output:
      print(x)
  elif choice==8 :
    schema.execute("SELECT Name FROM Physician WHERE EmployeeID IN (WITH New AS(SELECT DISTINCT Physician.EmployeeID AS Physician_IDFROM Physician,UndergoesWHERE Physician.EmployeeID = Undergoes.Physician ANDUndergoes.Procedure1 NOT IN (SELECT Trained_in.Treatment AS TreatmentFROM Physician,Trained_inWHERE Physician.EmployeeID = Trained_in.Physician AND Undergoes.Physician=Trained_in.Physician)) SELECT Physician_ID FROM New)")
    output=schema.fetchall()
    for x in output:
      print(x)
  elif choice==9 :
    schema.execute("SELECT Name FROM Physician WHERE EmployeeID in (SELECT Undergoes.Physician FROM Undergoes INNER JOIN Trained_in ON Undergoes.Physician=Trained_in.Physician WHERE Trained_in.Treatment=Undergoes.Procedure1 AND Undergoes.Date > Trained_in.CertificationExpires)")
    output=schema.fetchall()
    for x in output:
      print(x)
  elif choice==10 :
    schema.execute("WITH New AS (WITH New AS(SELECT Undergoes.Physician AS Physician, Undergoes.Procedure1 AS Procedure1,Undergoes.Date AS DateFROM Undergoes INNER JOIN Trained_in ON Undergoes.Physician=Trained_in.Physician WHERE Trained_in.Treatment=Undergoes.Procedure1 AND Undergoes.Date > Trained_in.CertificationExpires)SELECT Physician.Name AS Physician_Name,New.Procedure1 AS Procedure1, New.Date AS Date FROM Physician INNER JOIN New WHERE Physician.EmployeeID=New.Physician)SELECT New.Physician_Name,Procedure1.Name AS Procedure_Name, New.Date FROM New INNER JOIN Procedure1 ON Procedure1.Code=New.Procedure1")
    output=schema.fetchall()
    for x in output:
      print(x)
  elif choice==11 :
    schema.execute("WITH New AS(WITH New AS (SELECT Prescribes.Patient AS Patient, Prescribes.Physician AS Physician FROM Prescribes INNER JOIN Undergoes ON Prescribes.Patient= Undergoes.Patient INNER JOIN Procedure1 ON Procedure1.Code=Undergoes.Procedure1 WHERE Procedure1.Cost>5000),Apnt_Table AS (WITH New AS(SELECT Appointment.Patient AS Patient, COUNT(*) AS Count_PatientFROM Appointment,Affiliated_with,Department WHERE Affiliated_with.Physician=Appointment.Physician AND Affiliated_with.Department=Department.DepartmentID AND Department.Name='cardiology' GROUP BY Appointment.Patient  ) SELECT Patient FROM New WHERE Count_Patient>1 )SELECT New.Patient AS Patient , New.Physician AS Physician FROM New INNER JOIN Apnt_Table ON New.Patient=Apnt_Table.Patient WHERE New.Physician  NOT IN (SELECT Physician.EmployeeID AS Physician FROM Physician INNER JOIN Department ON Department.Head=Physician.EmployeeID))SELECT Patient.Name AS Patient_Name, Physician.Name AS Physician_Name FROM Patient INNER JOIN New ON New.Patient=Patient.SSN INNER JOIN Physician ON New.Physician=Physician.EmployeeID")
    output=schema.fetchall()
    for x in output:
      print(x)
  elif choice==12 :
    schema.execute("SELECT Name,Brand FROM Medication WHERE Code = (WITH New AS(SELECT Medication, COUNT(*) as Prescribes_New FROM Prescribes GROUP BY Medication)SELECT Medication FROM New WHERE Prescribes_New =(WITH New AS (SELECT Medication, COUNT(*) as Prescribes_New FROM Prescribes GROUP BY Medication ORDER BY Prescribes_New DESC LIMIT 1) SELECT Prescribes_New FROM New))")
    output=schema.fetchall()
    for x in output:
      print(x)
  elif choice==13:
    procedure=input("Enter the procedure name: ")
    l="SELECT Name FROM Physician WHERE EmployeeID in(SELECT Physician FROM Trained_in WHERE Treatment in(SELECT Code FROM Procedure1 WHERE Name='"+ procedure +"'))"
    schema.execute(l)
    output=schema.fetchall()
    for x in output:
      print(x)
  else :
    print("Invalid choice!!")
  ch=input("Want to continue?(0/1)")
  
  




