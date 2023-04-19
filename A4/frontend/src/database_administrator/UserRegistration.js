import "@progress/kendo-theme-default/dist/all.css";
import Cookies from "js-cookie";

function UserRegistration(prop){

    function addUser(e){
        e.preventDefault();
        var data = {
            username: e.target.username.value,
            password: e.target.password.value,
            email: e.target.email.value,
            designation: e.target.designation.value
        }

        fetch(process.env.REACT_APP_BACKEND_URL.concat("api/adduser/"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": Cookies.get("csrftoken")
            },
            body: JSON.stringify(data)
        }).then((response) => response.json()).then((data) => {
            console.log(data);
            if(data.hasOwnProperty("Error")){
                alert(data.Error);
            }else{
                alert(data.Success);
                prop.setuserData([...prop.userData, data]);
            }
        });
    }


    return(
        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Patient Information</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form onSubmit= {addUser}>
                    <div class="modal-body">
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="basic-addon1">Username</span>
                            <input type="text" name = "username" class="form-control" placeholder="Username" aria-label="username" />
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="basic-addon1">Password</span>
                            <input type="password" name = "password" class="form-control" placeholder="Password" aria-label="password" />
                        </div>
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="basic-addon1">Email</span>
                            <input type="text" name="email" class="form-control" placeholder="Email" aria-label="email" />
                        </div>
                        <div class="input-group mb-3">
                            <select class="form-select" name="designation" aria-label="Default select example">
                                <option selected>Select Designation</option>
                                <option value="doctor">Doctor</option>
                                <option value="front_desk_operator">Frontdesk Operator</option>
                                <option value="database_admin">Database Administrator</option>
                                <option value="data_entry_operator">Data Entry Operator</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Save Data</button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}

export default UserRegistration;