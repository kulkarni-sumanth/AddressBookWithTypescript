var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var FormOperations = /** @class */ (function () {
    function FormOperations() {
        var _this = this;
        this.removeErrors = function (inputField) {
            var fetchId = inputField.name + "-error";
            var errorMessage = document.getElementById("".concat(fetchId));
            errorMessage.innerText = "";
        };
        this.validateInput = function (event, inputField) {
            if (event === void 0) { event = null; }
            if (inputField === void 0) { inputField = null; }
            if (event)
                var inputField = event.currentTarget;
            inputField.hasError = false;
            _this.removeErrors(inputField);
            switch (inputField.name) {
                case "mobile": {
                    _this.validateContactNumber(inputField);
                    break;
                }
                case "email": {
                    _this.validateEmail(inputField);
                    break;
                }
                case "websiteURL": {
                    _this.validateURL(inputField);
                    break;
                }
            }
            if (inputField.value == "") {
                var fetchId = inputField.name + "-error";
                var showError = document.getElementById("".concat(fetchId));
                showError.innerText = inputField.name + " is required";
                inputField.hasError = true;
            }
        };
        this.validateContactNumber = function (inputField) {
            inputField.hasError = false;
            if (inputField.value && FormOperations.contactNumberRegex.test(inputField.value) == false) {
                document.getElementById("".concat(inputField.name, "-error")).innerText = "invalid mobile number";
                inputField.hasError = true;
            }
        };
        this.validateEmail = function (inputField) {
            inputField.hasError = false;
            if (inputField.value && FormOperations.mailRegex.test(inputField.value) == false) {
                document.getElementById("".concat(inputField.name, "-error")).innerText = inputField.value + " is wrong";
                inputField.hasError = true;
            }
        };
        this.validateURL = function (inputField) {
            inputField.hasError = false;
            if (inputField.value && FormOperations.URLRegex.test(inputField.value) == false) {
                document.getElementById("".concat(inputField.name, "-error")).innerText = inputField.value + " is wrong";
                inputField.hasError = true;
            }
        };
        this.submitForm = function (event) {
            var errorCount = 0;
            for (var i = 0; i < _this.requiredFields.length; i++) {
                _this.validateInput(null, _this.requiredFields[i]);
                if (_this.requiredFields[i].hasError == true)
                    errorCount += 1;
            }
            if (errorCount > 0) {
                _this.invalidDetails.style.display = "block";
            }
            else {
                _this.invalidDetails.style.display = "none";
                var formObject = new FormData(_this.form);
                var formData = Object.fromEntries(formObject);
                if (event.currentTarget.value == "Add") {
                    employeeOperationsobj.addToStorage(formData);
                }
                else
                    employeeOperationsobj.updateEmployee(formData);
                _this.form.reset();
            }
            event.preventDefault();
        };
        this.removeErrorMessages = function () {
            for (var i = 0; i < _this.requiredFields.length; i++) {
                _this.removeErrors(_this.requiredFields[i]);
            }
            _this.invalidDetails.style.display = "none";
        };
        this.handleEnter = function (event) {
            if (event.key === "Enter") {
                var index = __spreadArray([], _this.form, true).indexOf(event.target);
                if (event.target.type != "textarea" && event.target.type != "submit") {
                    event.preventDefault();
                    _this.form.elements[index + 1].focus();
                }
            }
        };
        this.form = document.querySelector(".popup form");
        this.invalidDetails = document.querySelector(".fill-all");
        this.requiredFields = document.getElementsByClassName("requiredField");
        this.submitButton = document.querySelector(".popup .submit-button");
        for (var i = 0; i < this.requiredFields.length; i++) {
            this.requiredFields[i].addEventListener("input", this.validateInput);
        }
        this.submitButton.addEventListener("click", this.submitForm);
    }
    ;
    FormOperations.contactNumberRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    FormOperations.mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    FormOperations.URLRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return FormOperations;
}());
var EmployeeOperations = /** @class */ (function () {
    function EmployeeOperations() {
        var _this = this;
        this.loadEmployeeDetails = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, employees, _i, employees_1, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("https://localhost:7222/api/Employee/GetAll")];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        employees = _a.sent();
                        for (_i = 0, employees_1 = employees; _i < employees_1.length; _i++) {
                            key = employees_1[_i];
                            this.appendEmployeeToList(key);
                        }
                        this.defaultDisplay();
                        return [2 /*return*/];
                }
            });
        }); };
        this.addToStorage = function (formData) { return __awaiter(_this, void 0, void 0, function () {
            var response, employee;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("https://localhost:7222/api/Employee/AddEmployee", {
                            headers: {
                                "Content-Type": "application/json"
                            },
                            method: "POST",
                            body: JSON.stringify(formData)
                        })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        employee = _a.sent();
                        this.addEmployee(employee);
                        return [2 /*return*/];
                }
            });
        }); };
        this.addEmployee = function (employee) {
            _this.appendEmployeeToList(employee);
            _this.showEmployeeDetails(null, employee.id);
            _this.popUp.classList.toggle("toggle-popup");
            _this.home.classList.add("active");
            _this.addButton.classList.toggle("active");
        };
        this.appendEmployeeToList = function (employee) {
            var htmlString = "<li class=\"list-item\" id=\"".concat(employee.id, "\">\n                                <h2 class=\"contact-name\">").concat(employee.name, "</h2>\n                                <div class=\"more-details\">\n                                    <p class=\"mail\">").concat(employee.email, "</p>\n                                    <p class=\"contact-number\">").concat(employee.mobileNumber, "</p>\n                                </div>\n                        </li>");
            _this.contactList.insertAdjacentHTML('beforeend', htmlString);
            var employeeItem = document.getElementById("".concat(employee.id));
            employeeItem.addEventListener("click", _this.showEmployeeDetails);
        };
        this.showEmployeeDetails = function (event, defaultID) {
            if (event === void 0) { event = null; }
            if (defaultID === void 0) { defaultID = null; }
            return __awaiter(_this, void 0, void 0, function () {
                var employeeId, response, data, keys, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.popUp.classList.contains("toggle-popup") && event != null) {
                                this.popUp.classList.remove("toggle-popup");
                                this.addButton.classList.remove("active");
                                this.home.classList.add("active");
                            }
                            employeeId = event == null ? defaultID : event.currentTarget.getAttribute("id");
                            this.selectedEmployee = employeeId.toString();
                            return [4 /*yield*/, fetch("https://localhost:7222/api/Employee/GetById/".concat(employeeId))];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.json()];
                        case 2:
                            data = _a.sent();
                            keys = Object.keys(data);
                            this.employeeDetails.style.display = 'block';
                            for (i = 0; i < this.dynamicDataFields.length; i++)
                                this.dynamicDataFields[i].innerHTML = data[keys[i + 1]];
                            return [2 /*return*/];
                    }
                });
            });
        };
        this.loadDetailsIntoForm = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, employee, keys, formElements, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("https://localhost:7222/api/Employee/GetById/".concat(this.selectedEmployee))];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        employee = _a.sent();
                        keys = Object.keys(employee);
                        formElements = this.form.elements;
                        for (i = 0; i < formElements.length - 1; i++)
                            formElements[i].value = employee[keys[i + 1]];
                        return [2 /*return*/];
                }
            });
        }); };
        this.updateEmployee = function (employee) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        employee["Id"] = parseInt(this.selectedEmployee);
                        return [4 /*yield*/, fetch("https://localhost:7222/api/Employee/Update", {
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                method: "POST",
                                body: JSON.stringify(employee)
                            })];
                    case 1:
                        _a.sent();
                        document.getElementById("".concat(this.selectedEmployee)).innerHTML =
                            "<h2 class=\"contact-name\">".concat(employee.name, "</h2>\n                        <div class=\"more-details\">\n                            <p class=\"mail\">").concat(employee.email, "</p>\n                            <p class=\"contact-number\">").concat(employee.mobileNumber, "</p>\n                        </div>");
                        this.popUp.classList.toggle("toggle-popup");
                        this.showEmployeeDetails(null, parseInt(this.selectedEmployee));
                        return [2 /*return*/];
                }
            });
        }); };
        this.removeEmployee = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("https://localhost:7222/api/Employee/DeleteById/".concat(this.selectedEmployee))];
                    case 1:
                        _a.sent();
                        document.getElementById("".concat(this.selectedEmployee)).remove();
                        this.employeeDetails.style.display = "none";
                        this.defaultDisplay();
                        return [2 /*return*/];
                }
            });
        }); };
        this.defaultDisplay = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, employees;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("https://localhost:7222/api/Employee/GetAll")];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        employees = _a.sent();
                        if (employees.length)
                            this.showEmployeeDetails(null, employees[0].id);
                        return [2 /*return*/];
                }
            });
        }); };
        this.onAddButtonClick = function () {
            _this.submitButton.setAttribute("value", "Add");
            if (_this.popUp.classList.contains("toggle-popup")) {
                _this.popUp.classList.remove("toggle-popup");
                _this.home.classList.add("active");
                _this.addButton.classList.remove("active");
                _this.defaultDisplay();
            }
            else {
                _this.employeeDetails.style.display = 'none';
                _this.home.classList.remove("active");
                _this.popUp.classList.add("toggle-popup");
                _this.addButton.classList.add("active");
                _this.form.reset();
            }
            formOperationsObj.removeErrorMessages();
        };
        this.onHomeButtonClick = function () {
            _this.home.classList.add("active");
            _this.addButton.classList.remove("active");
            if (_this.popUp.classList.contains("toggle-popup"))
                _this.popUp.classList.toggle("toggle-popup");
            _this.defaultDisplay();
        };
        this.onEditButtonClick = function () {
            _this.submitButton.setAttribute("value", "Update");
            _this.popUp.classList.toggle("toggle-popup");
            _this.employeeDetails.style.display = 'none';
            formOperationsObj.removeErrorMessages();
        };
        this.home = document.querySelector(".home");
        this.popUp = document.querySelector(".popup");
        this.editButton = document.getElementById("edit");
        this.deleteButton = document.getElementById("delete");
        this.form = document.querySelector(".popup form");
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
    }
    ;
    return EmployeeOperations;
}());
var formOperationsObj = new FormOperations();
var employeeOperationsobj = new EmployeeOperations();
