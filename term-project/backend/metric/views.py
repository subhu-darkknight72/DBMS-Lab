from django.shortcuts import render
import psycopg2

HOST = 'localhost'
DBNAME = 'gr47'
USER = 'gr47'
PASSWORD = '123'
PORT = '5432'


def get_query(request):
    if (request.method) == 'POST':
        query = request.POST.get('query')
        context = {
            'success': 1,
            'query': query
        }

        # Connect to the database
        conn = psycopg2.connect(database=DBNAME, user=USER,
                                password=PASSWORD, host=HOST, port=PORT)

        # create a cursor object to execute SQL queries
        cur = conn.cursor()
        cur.execute('SELECT pg_stat_statements_reset();')
        try:
            query = query.strip()
            if query[-1] == ';':
                query = query[:-1]

            # executive given query
            cur.execute(query)

            # Retrieve the statistics for the query from pg_stat_statements
            cur.execute(
                "SELECT * FROM pg_stat_statements WHERE query = %s", (query,))
            stats = cur.fetchone()

            # Adding the statistics to context
            for i, column in enumerate(cur.description):
                context[column.name] = stats[i]

            query = "EXPLAIN "+query
            cur.execute(query)
            res = cur.fetchall()

            context['explain'] = res

        except:
            context['success'] = 0

        cur.close()
        conn.close()

        # printing context for debugging in terminal
        print(context)
        if context['success']:
            return render(request, 'show.html', context)
        return render(request, 'error.html', context)
    else:
        return render(request, 'home.html')
