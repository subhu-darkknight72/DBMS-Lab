import mysql.connector
from mysql.connector import errorcode

def print_query(res):
	if len(res)==0:
		print("Record not-Found!!")
		return

	for x in res:
		print(x)
	return

def query13():
	# proc = "angioplasty"
	proc = input("Enter Procedure Type: ")
	cmd = "SELECT `Name` FROM Physician WHERE EmployeeID IN (SELECT Physician FROM Trained_In WHERE Treatment IN (    SELECT Code    FROM `Procedure`    WHERE `Name`='"+proc+"'));"
	
	relation.execute(cmd)
	print_query(relation.fetchall())
	return

try:
	db_name = "A3_Py"
	cnx = mysql.connector.connect(user='root', database=db_name)
	print("Database connected")
	
	# create_tables
	relation=cnx.cursor()
	# relation.execute('CREATE TABLE Physician(EmployeeID int NOT NULL,Name varchar(50),Position varchar(50),SSN int,PRIMARY KEY(EmployeeID))')
	c1 = input("Create and Fill Table (y/n)? ")
	if c1=='y' or c1=='Y':
		with open('cmd.txt') as f:
			lines = [line.rstrip() for line in f]
			for l in lines:
				relation.execute(l)
				cnx.commit()
	
	Q = dict()
	with open('query.txt') as f:
		lines = [line.rstrip() for line in f]
		for i,l in enumerate(lines):
			relation.execute(l)
			Q[i+1] = relation.fetchall()

	print("Type end to terminate.")
	while(True):
		cno = input("Q_No : ")
		if cno=="end":
			break
		cno = int(cno)
		if cno<1 or cno>13:
			print("Incorrect id!!")
			continue

		if(cno==13):
			query13()
		else:
			print_query(Q[int(cno)])

except mysql.connector.Error as err:
	if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
		print("Something is wrong with your user name or password")
	elif err.errno == errorcode.ER_BAD_DB_ERROR:
		print("Database does not exist")
	else:
		print(err)
else:
	cnx.close()

