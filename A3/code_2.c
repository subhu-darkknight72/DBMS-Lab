// gcc -o s code_2.c -Imysql -Lmysql/8.0.32/lib `mysql_config --libs`
#include <stdio.h>
#include <stdlib.h>
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

    fp = fopen("query.txt", "r");
    if (fp == NULL)
        exit(EXIT_FAILURE);

    while ((read = getline(&line, &len, fp)) != -1) {
        // printf("%s", line);
        printf("Hello\n");
    }

    fclose(fp);
    if (line)
        free(line);

    mysql_close(con);
    exit(0);
}