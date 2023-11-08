function Validator(formSelector){
    //gan gia tri mat dinh cho tham so (js es5)
    var  formRules = {};
    var _this = this;
    function getParent(element,selector){
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }

            element = element.parentElement;
        }
    }

    
    var validatorRules = {
        required: function(value){
            return value ? undefined : "vui long nhap truong nay";
        },
        email: function(value){
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            return emailRegex.test(value) ? undefined: "vui long nhap email"
        },
        min: function(min){
            return function(value){
                return value.length>= min ? undefined : `vui long nhap ${min} kí tự`;
            }
        },
        max: function(max){
            return function(value){
                return value.length <= max ? undefined : `vui long nhap ${max} kí tự`;
            }
        },
    };



    var formElenment = document.querySelector(formSelector);

    if(formElenment){
        var inputs = formElenment.querySelectorAll('[name][rules]')
        //console.log(inputs)
        for(var input of inputs){
            var ruleInfor;
            var rules = input.getAttribute('rules').split('|');
            for(var rule of rules){
                var isRuleHasValue = rule.includes(":");
                if(isRuleHasValue){
                    ruleInfor = rule.split(':');
                    rule = ruleInfor[0];
                }

                
                var ruleFunc = validatorRules[rule]
                if(isRuleHasValue){
                    ruleFunc =ruleFunc(ruleInfor[1])
                }
                if(Array.isArray(formRules[input.name])){
                    formRules[input.name].push(ruleFunc);
                }else{
                    formRules[input.name] = [ruleFunc];
                }            
            }  
            //lang nghe su kien de validate ( onblur , onchange , ..)
            
            input.onblur = handleValidate;
            input.oninput = handleClearError;  
        }
        //ham thuc hien validate
        function handleValidate(event){
            var rules = formRules[event.target.name];
            var error;

            for( var rule of rules){
                error =  rule(event.target.value);
                if(error) break;
            }
           
            // neu co loi hien thi loi 
            if(error){
                getParent(event.target);
                var formGroup = getParent(event.target,'.form-group')

                if(formGroup){
                    formGroup.classList.add('invalid') ;
                    var formMess = formGroup.querySelector(".form-message")
                    if(formMess){
                        formMess.innerText =  error;
                    }
                }
            }

            return !error;
        }
        //ham clear mess lỗi
        function handleClearError(event){
            var formGroup = getParent(event.target,'.form-group')
            if(formGroup){
                if(formGroup.classList.contains('invalid')){
                    formGroup.classList.remove('invalid');
                }
                var formMess = formGroup.querySelector(".form-message");
                if(formMess){
                    formMess.innerText ="";

                }
            }
        }
    }


    //SU LI HANH VI SUBMIT FORM
    formElenment.onsubmit = function(event ){
        event.preventDefault();

        // console.log(_this)


        var inputs = formElenment.querySelectorAll('[name][rules]')
        var isValid = true;
        for(var input of inputs){
            if(!handleValidate({target:input})){
                isValid = false;
            }
        }

        if(isValid){
            if(typeof _this.onSubmit === 'function'){

                var EnableInput = formElenment.querySelectorAll('[name]:not([disabled])');
            
                    var formValues = Array.from(EnableInput).reduce(function(values,input){
                        switch(input.type){
                            case  'radio':
                                values[input.name] = formElenment.querySelector('input[name="' + input.name +'"]:checked').value;
                                break;
                            case 'checkbox':
                                if(input.matches(':checked')) {
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
                return _this.onSubmit(formValues);
            }
            formElenment.submit();
        }
    }
}