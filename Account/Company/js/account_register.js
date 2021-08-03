const xhr = new XMLHttpRequest();
var host = "https://api.rebbity.com";

function nextStepClick() {
    var form = document.getElementById('frmCreateAccount');
    var json = {
        "Name": form.Name.value,
        "Email": form.Email.value,
        "Password": form.Password.value,
        "ConfirmPassword": form.ConfirmPassword.value,
        "PhoneNumber": form.PhoneNumber.value,
        "AcceptTerms": form.AcceptTerms.checked
    }
    
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', form.action, true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF8;');
    xhr.origin = origin;
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status == 400) {
            var errors = xhr.response.errors;
            Object.entries(errors).forEach(entry => {
                const [key, value] = entry;
                enableError(key, value);
                console.log(key, value);
            });

        } else if (status == 200) {
            loginAccount(form.Email.value, form.ConfirmPassword.value);
            show("confirmAccountModal");
        }
        loadingHide();
    };
    loadingShow();
    xhr.send(JSON.stringify(json));
}

function isAuthenticated() {
    var cookies = getCookie("Authentication");

}

function loadingShow() {
    var loading = document.getElementById('loading');
    loading.style.display = 'block';

    var form = document.getElementById('frmCreateAccount');
    form.style.display = 'none';

    var buttons = document.getElementById('buttons');
    buttons.style.display = 'none';
}

function loadingHide() {
    var loading = document.getElementById('loading');
    loading.style.display = 'none';

    var form = document.getElementById('frmCreateAccount');
    form.style.display = 'block';

    var buttons = document.getElementById('buttons');
    buttons.style.display = 'inline-flex';
}

function sendEmailConfirmation() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', host + 'api/Account/SendEmailConfirmation', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF8;');
    xhr.origin = origin;
    xhr.responseType = 'json';
    xhr.onload = function () {

    };
    xhr.send();
}

function loginAccount(user, password) {
    var xhr = new XMLHttpRequest();
    var url = host + "Api/login/FirstStep?user=" + user;
    xhr.open('GET', url, true);
    xhr.orgin = origin;
    xhr.withCredentials = true;
    xhr.responseType = 'json';
    xhr.onload = function () {
        url = host + 'api/Login/SecondStep?set_cookie=true&fs_id=' + xhr.response.id + '&key=' + xhr.response.key + '&pwd=' + password;
        xhr.open('GET', url, true);
        xhr.onload = function () {
            sendEmailConfirmation();
        }
        xhr.send();
    };
    xhr.send();
}

function confirmCode() {
    var xhr = new XMLHttpRequest();
    var code = document.getElementById('ConfirmationCode').value;
    var url = host + 'api/Account/ConfirmEmail?code=' + code + '&email=' + document.getElementById('frmCreateAccount').Email.value;
    xhr.open('POST', url, true);
    xhr.orgin = origin;
    xhr.withCredentials = true;
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status != 200) {
            enableError('ConfirmationCode', 'Codigo invalido!');
        } else {
            window.location.href = 'RegisterCompany.html';
        }
    };
    xhr.send();
}