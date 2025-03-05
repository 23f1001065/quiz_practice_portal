from flask import current_app as app, render_template

# controller for delivering base html page

@app.route("/",methods=[ "GET" ])
def provide_base_template():
    return render_template('index.html')