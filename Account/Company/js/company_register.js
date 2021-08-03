var host = "https://api.rebbity.com";

function zipCodeKeyUp() {
    var field = document.getElementById('WithdrawalCep');
    zipCodeMask(field);
}

function createCompanyClick() {
    var form = document.getElementById('frmCompany');
    var frmCategory = document.getElementById('CompanyCategory');
    var url = host + 'api/Account/Company/SearchCompanyCategory?unique=true&page=0&search_key=' + frmCategory.value;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.withCredentials = true;
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status = 200) {
            var response = xhr.response;
            var json =
            {
                "name": form.Name.value,
                "description": null,
                "adressCompany": null,
                "adressDelivery": null,
                "adressWithdrawal": null,
                "companyCategory": response.id,
                "cpfOrCnpj": form.CpfOrCnpj.value,
                "phoneNumber": form.PhoneNumber.value,
                "billingMonthly": parseFloat(form.BillingMonthly.value).toFixed(2),
                "employeesNumber": form.EmployeesNumber.value,
                "ownDelivery": form.OwnerDelivery.checked,
                "openingHours": null
            }

            xhr.origin = origin;
            xhr.open('PUT', form.action, true);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8;');
            xhr.responseType = 'json'
            xhr.onload = function () {
                var status = xhr.status;
                if (status == 400) {
                    var errors = xhr.response.errors;
                    Object.entries(errors).forEach(entry => {
                        const [key, value] = entry;
                        enableError(key, value);
                        console.log(key, value);
                    });
                }

                if (status == 200) {
                    var modal = document.getElementById('CompanyAdressModal');
                    modal.style.display = 'block';
                }
            }
            xhr.send(JSON.stringify(json));
        }
        if (status == 404) {
            enableError('CompanyCategory', 'Selecione uma categoria valida!');
        }
    }
    if (frmCategory.value.length > 1) {
        xhr.send();
    } else {
        enableError('CompanyCategory', 'Selecione uma categoria!');
    }
}

function searchCategories() {
    var url = host + 'api/Account/Company/SearchCompanyCategory?page=0&search_key=';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.withCredentials = false;
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status = 200) {
            var datalist = document.getElementById('CategoriesList');
            Object.entries(xhr.response).forEach(entry => {
                const [position, category, description] = entry;
                datalist.innerHTML = datalist.innerHTML + '<option value="' + category.name + '">' + category.description + '</option>';
            });
        }
    }
    xhr.send();
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
