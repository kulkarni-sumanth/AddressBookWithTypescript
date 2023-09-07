class FormOperations {

    static contactNumberRegex : RegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    static mailRegex : RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    static URLRegex : RegExp = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    invalidDetails : HTMLElement;
    form : HTMLFormElement;
    requiredFields : HTMLCollection;
    submitButton : HTMLElement;

    constructor() {
        this.form = document.querySelector(".popup form") as HTMLFormElement;
        this.invalidDetails = document.querySelector(`.fill-all`) as HTMLElement;
        this.requiredFields = document.getElementsByClassName("requiredField");
        this.submitButton = document.querySelector(".popup .submit-button");

        for(let i=0; i<this.requiredFields.length; i++) {
            this.requiredFields[i].addEventListener("input", this.validateInput);
        }
        this.submitButton.addEventListener("click", this.submitForm);
    };

    removeErrors = (inputField) : void => {
        var fetchId = inputField.name + "-error";
        var errorMessage = document.getElementById(`${fetchId}`);
        errorMessage.innerText = "";
    };
    
    validateInput = (event = null, inputField = null) : void => {
        if (event)
            var inputField = event.currentTarget;
        inputField.hasError = false;  
        this.removeErrors(inputField);

        switch(inputField.name) {
            case "mobile": {
                this.validateContactNumber(inputField);
                break;
            }
            case "email": {
                this.validateEmail(inputField);
                break;
            }
            case "websiteURL": {
                this.validateURL(inputField);
                break;
            }
        }
    
        if (inputField.value == "") {   
            var fetchId = inputField.name + "-error";
            var showError = document.getElementById(`${fetchId}`);
            showError.innerText = inputField.name + " is required";
            inputField.hasError = true;
        }
    };
    
    validateContactNumber = (inputField) : void => {
        inputField.hasError = false;
        
        if (inputField.value && FormOperations.contactNumberRegex.test(inputField.value) == false ) {
            document.getElementById(`${inputField.name}-error`).innerText = "invalid mobile number";
            inputField.hasError = true;
        }
    };
    
    validateEmail = (inputField) : void => {
        inputField.hasError = false;
        
        if (inputField.value && FormOperations.mailRegex.test(inputField.value) == false ) {
            document.getElementById(`${inputField.name}-error`).innerText = inputField.value + " is wrong";
            inputField.hasError = true;
        }
    };

    validateURL = (inputField) : void => {
        inputField.hasError = false;
        
        if (inputField.value && FormOperations.URLRegex.test(inputField.value) == false ) {
            document.getElementById(`${inputField.name}-error`).innerText = inputField.value + " is wrong";
            inputField.hasError = true;
        }
    };
    
    submitForm = (event : Event) : void => {

        var errorCount : number = 0;

        for(let i=0; i<this.requiredFields.length; i++) {
            this.validateInput(null, this.requiredFields[i]);
            if ((this.requiredFields[i] as any).hasError == true)
                errorCount += 1;
        }
    
        if (errorCount > 0) {
            this.invalidDetails.style.display = "block";
        }
        else {
            this.invalidDetails.style.display = "none";
            var formObject = new FormData(this.form);
            var formData = Object.fromEntries(formObject as any);

            if ((event.currentTarget as HTMLInputElement).value == "Add") {
                employeeOperationsobj.addToStorage(formData);
            }
            else
                employeeOperationsobj.updateEmployee(formData);
            this.form.reset();
        }
        
        event.preventDefault();
    };
    
    removeErrorMessages = () : void => {

        for(let i=0; i<this.requiredFields.length; i++) {
            this.removeErrors(this.requiredFields[i]);
        }
        
        this.invalidDetails.style.display = "none";
    };
    
    handleEnter = (event) => {
        if (event.key === "Enter") {
           var index = [...this.form as any].indexOf(event.target);
           if (event.target.type != "textarea" && event.target.type != "submit") {
                event.preventDefault();
                (this.form.elements[index + 1] as HTMLInputElement).focus();
           }
         }
     };
}

class EmployeeOperations {

    id: number;
    selectedEmployee : string;
    home : HTMLElement ;
    popUp : HTMLElement ;
    editButton : HTMLElement ;
    deleteButton : HTMLElement;
    form : HTMLFormElement;
    addButton : HTMLElement ;
    submitButton : HTMLElement ;
    dynamicDataFields : HTMLCollection ;
    contactList : HTMLElement ;
    employeeDetails : HTMLElement ;

    constructor() {

        this.home = document.querySelector(".home");
        this.popUp = document.querySelector(".popup");
        this.editButton = document.getElementById("edit");
        this.deleteButton = document.getElementById("delete");
        this.form = document.querySelector(".popup form") as HTMLFormElement;
        this.addButton = document.querySelector(".add-employee");
        this.submitButton = document.querySelector(".popup .submit-button");
        this.dynamicDataFields = document.getElementsByClassName("dynamic-data");
        this.contactList = document.querySelector(".contact-list");
        this.employeeDetails = document.getElementById("employee-details");

        window.addEventListener("load", this.loadEmployeeDetails);

        this.deleteButton.addEventListener("click", this.removeEmployee);
        this.editButton.addEventListener("click", this.loadDetailsIntoForm);
        this.form.addEventListener('keypress', formOperationsObj.handleEnter);
        this.editButton.addEventListener("click", this.onEditButtonClick);
        this.addButton.addEventListener("click", this.onAddButtonClick.bind(this));
        this.home.addEventListener("click", this.onHomeButtonClick);
    };

    loadEmployeeDetails = async () : Promise<void> => {
        var response = await fetch("https://localhost:7222/api/Employee/GetAll");
        var employees = await response.json();
        for(var key of employees) 
            this.appendEmployeeToList(key);
        this.defaultDisplay();
    };
    
    addToStorage = async (formData) : Promise<void> => {
        var response = await fetch("https://localhost:7222/api/Employee/AddEmployee", {
            headers:{
                "Content-Type": "application/json"
            },
            method:"POST",
            body: JSON.stringify(formData)
        });
        var employee = await response.json();
        this.addEmployee(employee);
    };
    
    addEmployee = (employee) : void => {
        this.appendEmployeeToList(employee);
        this.showEmployeeDetails(null, employee.id);
        this.popUp.classList.toggle("toggle-popup");
        this.home.classList.add("active");
        this.addButton.classList.toggle("active");
    };
    
    appendEmployeeToList = (employee) : void => {
        var htmlString = `<li class="list-item" id="${employee.id}">
                                <h2 class="contact-name">${employee.name}</h2>
                                <div class="more-details">
                                    <p class="mail">${employee.email}</p>
                                    <p class="contact-number">${employee.mobileNumber}</p>
                                </div>
                        </li>`;
        this.contactList.insertAdjacentHTML('beforeend', htmlString);
        var employeeItem = document.getElementById(`${employee.id}`);
        employeeItem.addEventListener("click", this.showEmployeeDetails);

    };

    showEmployeeDetails = async (event : Event = null, defaultID : number = null) : Promise<void> =>  {
        if (this.popUp.classList.contains("toggle-popup") && event != null) {
            this.popUp.classList.remove("toggle-popup");
            this.addButton.classList.remove("active");
            this.home.classList.add("active");
        }
        
        var employeeId = event == null ? defaultID : (event.currentTarget as HTMLElement).getAttribute("id");
        this.selectedEmployee = employeeId.toString();
        var response = await fetch(`https://localhost:7222/api/Employee/GetById/${employeeId}`);
        var data = await response.json();
    
        var keys = Object.keys(data);
        this.employeeDetails.style.display = 'block';
        
        for (var i=0; i<this.dynamicDataFields.length; i++) 
            this.dynamicDataFields[i].innerHTML = data[keys[i+1]];
    };
    
    loadDetailsIntoForm = async () : Promise<void> => {
        var response = await fetch(`https://localhost:7222/api/Employee/GetById/${this.selectedEmployee}`);
        var employee = await response.json();
        var keys = Object.keys(employee);
        var formElements = this.form.elements;
        for(var i=0; i<formElements.length-1; i++) 
            (formElements[i] as HTMLFormElement).value = employee[keys[i+1]];
    };
    
    updateEmployee = async (employee) : Promise<void> => {

        employee["Id"] = parseInt(this.selectedEmployee);
        
        await fetch("https://localhost:7222/api/Employee/Update",{
            headers: {
                "Content-Type": "application/json"
            },
            method:"POST",
            body: JSON.stringify(employee)
            });

        document.getElementById(`${this.selectedEmployee}`).innerHTML =
                       `<h2 class="contact-name">${employee.name}</h2>
                        <div class="more-details">
                            <p class="mail">${employee.email}</p>
                            <p class="contact-number">${employee.mobileNumber}</p>
                        </div>`;
    
        this.popUp.classList.toggle("toggle-popup");
        this.showEmployeeDetails(null, parseInt(this.selectedEmployee));
    };
    
    removeEmployee = async () : Promise<void> => {
        await fetch(`https://localhost:7222/api/Employee/DeleteById/${this.selectedEmployee}`)
        document.getElementById(`${this.selectedEmployee}`).remove();
        this.employeeDetails.style.display = "none";
        this.defaultDisplay();
    };

    defaultDisplay = async () => {
        var response = await fetch("https://localhost:7222/api/Employee/GetAll");
        var employees = await response.json();
        if (employees.length)
                this.showEmployeeDetails(null, employees[0].id);
    };

    onAddButtonClick = () => {
        this.submitButton.setAttribute("value", "Add");
        if (this.popUp.classList.contains("toggle-popup")) {
            this.popUp.classList.remove("toggle-popup");
            this.home.classList.add("active");
            this.addButton.classList.remove("active");
            this.defaultDisplay();
        }
        else {
            this.employeeDetails.style.display = 'none';
            this.home.classList.remove("active");
            this.popUp.classList.add("toggle-popup");
            this.addButton.classList.add("active");
            this.form.reset();
        }
        formOperationsObj.removeErrorMessages();
    };

    onHomeButtonClick = () => {
        this.home.classList.add("active");
        this.addButton.classList.remove("active");
        if (this.popUp.classList.contains("toggle-popup"))
                this.popUp.classList.toggle("toggle-popup");
        this.defaultDisplay();
    };

    onEditButtonClick = () => {
        this.submitButton.setAttribute("value", "Update");
        this.popUp.classList.toggle("toggle-popup");
        this.employeeDetails.style.display = 'none';
        formOperationsObj.removeErrorMessages();
    };
}

var formOperationsObj =  new FormOperations();
var employeeOperationsobj = new EmployeeOperations();