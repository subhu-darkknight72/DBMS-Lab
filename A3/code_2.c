// gcc -o s code_2.c -Imysql -Lmysql/8.0.32/lib `mysql_config --libs`
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "mysql/8.0.32/include/mysql/mysql.h"

int main(int argc, char **argv){
    MYSQL *con = mysql_init(NULL);

    if (con == NULL){
        fprintf(stderr, "%s\n", mysql_error(con));
        exit(1);
    }

    if (mysql_real_connect(con, "localhost", "root", "",NULL, 0, NULL, 0) == NULL){
        fprintf(stderr, "%s\n", mysql_error(con));
        mysql_close(con);
        exit(1);
    }

    if (mysql_query(con, "CREATE DATABASE testdb")){
        fprintf(stderr, "%s\n", mysql_error(con));
        mysql_close(con);
        // exit(1);
    }

    FILE * fp;
    char * line = NULL;
    size_t len = 0;
    ssize_t read;

    char qry[1000];
    strcpy(qry,"CREATE TABLE Physician( EmployeeID int NOT NULL, Name varchar(50), Position varchar(50), SSN int, PRIMARY KEY(EmployeeID));");
    mysql_query(con, qry);
    // fp = fopen("table_create.txt", "r");
    // if (fp == NULL) exit(EXIT_FAILURE);

    // while ((read = getline(&line, &len, fp)) != -1) {
    //     // printf("%s", line);
    //     // if (mysql_query(con, line))
    //     //     finish_with_error(con);
    //     mysql_query(con, line);
    //     printf("Hello\n");
    // }
    // fclose(fp);

    mysql_close(con);
    return 0;
}