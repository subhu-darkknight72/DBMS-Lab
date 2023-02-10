#include <global.h>
#include "mysql/8.0.32/include/mysql/mysql.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[]){
    MYSQL *connection;
    if((connection=mysql_init(NULL))==NULL){
        fprintf(stderr, "%s\n", mysql_error(connection));
        return 1;
    }

    if(mysql_real_connect(connection,"localhost","root","","A3_C","0",NULL,0)==NULL){
        fprintf(stderr,"%s\n",mysql_error(connection));
        mysql_close(connection);
        exit(1);
    }
    int ch;
    printf("Want to create tables and insert?(0/1):");
    scanf("%d",&ch);
    if(ch==1){
        char fileName[]="create_20CS30019.txt";
        FILE *fp=fopen(fileName,"r");
        if(fp==NULL){
            printf("File opening error\n");
            return 1;
        }

        char line[1024];

        while(fgets(line,sizeof(line),fp)!=NULL){
            
            if(mysql_query(connection,line)){
                fprintf(stderr,"%s\n",mysql_error(connection));
                continue;
            }
        }

    }
    char Queries[12][1024]={
        "SELECT Name FROM Physician WHERE EmployeeID in(SELECT Physician FROM Trained_in WHERE Treatment in (SELECT Code FROM Procedure1 WHERE Name='bypass surgery'));",
        "SELECT Name FROM Physician WHERE EmployeeID in(SELECT Physician FROM Trained_in WHERE Treatment in(SELECT Code FROM Procedure1 WHERE Name='bypass surgery')) and EmployeeID in (SELECT Physician FROM Affiliated_with WHERE Department in (SELECT DepartmentID FROM Department WHERE Name='cardiology'));",
        "SELECT Name FROM Nurse WHERE EmployeeID in (SELECT On_Call.Nurse FROM On_Call INNER JOIN Room ON Room.BlockCode=On_Call.BlockCode AND Room.BlockFloor=On_Call.BlockFloorWHERE Room.Number='123');",
        "SELECT Name, Address FROM Patient WHERE SSN in (SELECT Patient FROM Prescribes WHERE Medication in (SELECT Code FROM Medication WHERE Name='remdesivir'));",
        "SELECT Name, InsuranceID FROM Patient WHERE SSN in (WITH New AS (SELECT Patient, DATEDIFF(End,Start) as DIFF FROM Stay) SELECT Patient FROM New WHERE DIFF>15) AND SSN in (SELECT Patient FROM Stay WHERE Room in (SELECT Number FROM Room WHERE Type ='icu'));",
        "SELECT Name FROM Nurse WHERE EmployeeID in (SELECT AssistingNurse FROM Undergoes WHERE Procedure1 in (SELECT Code FROM Procedure1 WHERE Name='bypass surgery'));",
        "WITH New AS (SELECT Nurse.Name, Nurse.Position, Undergoes.Physician FROM Undergoes INNER JOIN Nurse ON Nurse.EmployeeID=Undergoes.AssistingNurse WHERE Undergoes.Procedure1 in (SELECT Code FROM Procedure1 WHERE Name='bypass surgery') ) SELECT New.Name AS Nurse_Name, New.Position AS Nurse_Position, Physician.Name AS Physician_Name FROM New INNER JOIN Physician ON Physician.EmployeeID=New.Physician;",
        "SELECT Name FROM Physician WHERE EmployeeID IN (WITH New AS(SELECT DISTINCT Physician.EmployeeID AS Physician_IDFROM Physician,UndergoesWHERE Physician.EmployeeID = Undergoes.Physician ANDUndergoes.Procedure1 NOT IN (SELECT Trained_in.Treatment AS TreatmentFROM Physician,Trained_inWHERE Physician.EmployeeID = Trained_in.Physician AND Undergoes.Physician=Trained_in.Physician)) SELECT Physician_ID FROM New);",
        "SELECT Name FROM Physician WHERE EmployeeID in (SELECT Undergoes.Physician FROM Undergoes INNER JOIN Trained_in ON Undergoes.Physician=Trained_in.Physician WHERE Trained_in.Treatment=Undergoes.Procedure1 AND Undergoes.Date > Trained_in.CertificationExpires);",
        "WITH New AS (WITH New AS(SELECT Undergoes.Physician AS Physician, Undergoes.Procedure1 AS Procedure1,Undergoes.Date AS DateFROM Undergoes INNER JOIN Trained_in ON Undergoes.Physician=Trained_in.Physician WHERE Trained_in.Treatment=Undergoes.Procedure1 AND Undergoes.Date > Trained_in.CertificationExpires)SELECT Physician.Name AS Physician_Name,New.Procedure1 AS Procedure1, New.Date AS Date FROM Physician INNER JOIN New WHERE Physician.EmployeeID=New.Physician)SELECT New.Physician_Name,Procedure1.Name AS Procedure_Name, New.Date FROM New INNER JOIN Procedure1 ON Procedure1.Code=New.Procedure1;",
        "WITH New AS(WITH New AS (SELECT Prescribes.Patient AS Patient, Prescribes.Physician AS Physician FROM Prescribes INNER JOIN Undergoes ON Prescribes.Patient= Undergoes.Patient INNER JOIN Procedure1 ON Procedure1.Code=Undergoes.Procedure1 WHERE Procedure1.Cost>5000),Apnt_Table AS (WITH New AS(SELECT Appointment.Patient AS Patient, COUNT(*) AS Count_PatientFROM Appointment,Affiliated_with,Department WHERE Affiliated_with.Physician=Appointment.Physician AND Affiliated_with.Department=Department.DepartmentID AND Department.Name='cardiology' GROUP BY Appointment.Patient  ) SELECT Patient FROM New WHERE Count_Patient>1 )SELECT New.Patient AS Patient , New.Physician AS Physician FROM New INNER JOIN Apnt_Table ON New.Patient=Apnt_Table.Patient WHERE New.Physician  NOT IN (SELECT Physician.EmployeeID AS Physician FROM Physician INNER JOIN Department ON Department.Head=Physician.EmployeeID))SELECT Patient.Name AS Patient_Name, Physician.Name AS Physician_Name FROM Patient INNER JOIN New ON New.Patient=Patient.SSN INNER JOIN Physician ON New.Physician=Physician.EmployeeID;",
        "SELECT Name,Brand FROM Medication WHERE Code = (WITH New AS(SELECT Medication, COUNT(*) as Prescribes_New FROM Prescribes GROUP BY Medication)SELECT Medication FROM New WHERE Prescribes_New =(WITH New AS (SELECT Medication, COUNT(*) as Prescribes_New FROM Prescribes GROUP BY Medication ORDER BY Prescribes_New DESC LIMIT 1) SELECT Prescribes_New FROM New));"
    }
    ch=1;
    while(ch){
        printf("Enter the query number:");
        scanf("%d",&ch);
        char qry[1024];
        if(ch==13){
            char procedure[1024];
            printf("Enter procedure name:");
            scanf("%[^\n]s",procedure);
            strcpy(qry,"SELECT Name FROM Physician WHERE EmployeeID in(SELECT Physician FROM Trained_in WHERE Treatment in (SELECT Code FROM Procedure1 WHERE Name='");
            strcat(qry,procedure);
            strcat(qry,"'));");
        }
        else if(ch<13 && ch>0){
            strcpy(qry,Queries[ch-1]);
        }
        else{
            printf("Invalid choice!\n");
            printf("Do you want to continue?(0/1):");
            scanf("%d",&ch);
            continue;
        }
        // execute the query
        if(mysql_query(connection,line)){
            fprintf(stderr,"%s\n",mysql_error(connection));
            continue;
        }
        MYSQL_RES *result;
        MYSQL_ROW rows;
        result =mysql_use_result(connection);
        int n=mysql_num_fields(result);
        MYSQL_FIELD * cols=mysql_fetch_fields(result);

        printf("------------------\n");
        for(int i=0;i<n;i++){
            printf("%s",cols[i].name);
            printf(" ");
        }
        printf("------------------\n");
        printf("\n");
        while ((rows = mysql_fetch_row(result)) != NULL){
            for(int i=0;i<n;i++){
                printf("%s", row[i]);
                
                printf(" ");
            }
            printf("\n");
        }
        printf("------------------\n");
        mysql_free_result(result);

        printf("Do you want to continue?(0/1):");
        scanf("%d",&ch);
        
    }
    mysql_close(connection);
    return 0;
}