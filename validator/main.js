//Doi tuong valdator
function Validator(options){
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    var selectorRules = {};

    // ham thuc hien validate
    function validate(inputElement ,rule){
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;

        var rules = selectorRules[rule.selector];
        //lap qua rung rule va kiem tra
        //neu co loi dung kiem tra
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        }
        
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
        
     }
        //lay element cua form
    var formElement = document.querySelector(options.form);
    if(formElement){

        //khi submit form 
        formElement.onsubmit = function(e){
            e.preventDefault();
            var isFormvalid = true;
            // thuc hien lap qua tung rule va lap qua cac viladate
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector);       
                var isvalid = validate(inputElement,rule)
                if(!isvalid){
                    isFormvalid = false;   
                }
            });

            if(isFormvalid){
                //truong hop submit vs js
                if(typeof options.onSubmit === 'function'){
                    var EnableInput = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(EnableInput).reduce(function(values,input){
                        
                        switch(input.type){
                            case  'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name +'"]:checked').value;
                                break;
                            case 'checkbox':
                                if(!input.matches(':checked')) {
                                    values[input.name] = [];
                                    return values;
                                };
                                if(!Array.isArray(values[input.name])){
                                    values[input.name] = [];
                                }

                                values[input.name].push(input.value);
                            case 'file':
                                values[input.name] = input.files;
                            default:
                                values[input.name] = input.value;
                        }
                        return values;
                    },{});
                    
                    options.onSubmit(formValues);
                }
                //truong hop submit vs hanh vi mac dinh
                else{
                    formElement.submit();
                }
            }
        }


        //lap qua moi rule va xu ly  lang nghe su kien blur, input
        options.rules.forEach(function(rule) {
            // luu lai cac rule cho moi input
            
            if(Array.isArray(selectorRules[rule.selector])){        
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] = [rule.test]
            }

            var inputElements = formElement.querySelectorAll(rule.selector);
            
            Array.from(inputElements).forEach(function(inputElement){
                //su ly truong hop onblur ra khoi input
                inputElement.onblur = function() {
                    validate(inputElement,rule)
                    
                }
                //su li khi nguoi dung nhap 
                inputElement.oninput = function(){
                    var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.errorSelector)
                    getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
                    errorElement.innerText='';
                }
            })

            


            

        });
    }
}
//parentElement lấy thể cha của 1 element
//định nghĩa các rules
//Nguyen tac cua cac rule
//1.khu co loi thi tra ra mess loi
//2 khi hop le khong tra ra cai l gi ca
Validator.isRequired = function(selector){
    return {
        selector: selector,
        test: function(value){
            //trim : loai bo dau cach
            return value ? undefined: 'Vui long nhap truong nay'
        }
    }
}
Validator.isEmail = function(selector , mess){
    return {
        selector: selector,
        test: function(value){
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            return emailRegex.test(value) ? undefined: mess
        }
    }
}

Validator.isPassword = function(selector,min){
    return {
        selector:selector,
        test: function(value){
            return  value.length >=min ? undefined: `vui long nhap ${min} kí tự`
        }
    }
}

Validator.isConfirmer = function(selector,getConfirmValue,mess){
    return {
        selector:selector,
        test: function(value){
            return value === getConfirmValue() ? undefined : mess ||'chua nhap mk'
        }
    }

}