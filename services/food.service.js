const database = require('../services/db.service')


var foodService = {
    
    calculAJR: function(data,callback){
        let res = data.map(x => {
            if (x.processedFood){
                let nutriments = foodService.calculProcessedFood(x.processedFood)
                switch(x.lunchType){
                    case "matin":
                        return {
                                "cal_pdej":nutriments.calories,
                                "lip_pdej":nutriments.lipide,
                                "glu_pdej":nutriments.glucide,
                                "sel_pdej":nutriments.sel,
                                "prot_pdej":nutriments.protein
                               }
                        break;
                    case "midi":
                        return {
                                "cal_dej":nutriments.calories,
                                "lip_dej":nutriments.lipide,
                                "glu_dej":nutriments.glucide,
                                "sel_dej":nutriments.sel,
                                "prot_dej":nutriments.protein
                               }
                        break;
                    case "soir":
                        return {
                                "cal_din":nutriments.calories,
                                "lip_din":nutriments.lipide,
                                "glu_din":nutriments.glucide,
                                "sel_din":nutriments.sel,
                                "prot_din":nutriments.protein
                               }
                        break;
                }
            }else{
                /*Les recettes mangées ne sont pas traité*/
                return "undefined"
            }
        })
        callback(foodService.completeTemplate(res))
    },
    
    calculProcessedFood(data){
        let coef = 1;
        let quantity = data.quantity;

        if (quantity.match(/(litre|litres|Litres|kg|L|l)$/)){
            coef = 1000
        }
        quantity.replace(/[a-z|/ ]/g,'');
        quantity = parseFloat(quantity);
        return {
                calories: (parseFloat(data.nutriments.calories)*quantity*coef)/100,
                lipide: 0,
                glucide: (parseFloat(data.nutriments.glucide)*quantity*coef)/100,
                protein: (parseFloat(data.nutriments.proteins)*quantity*coef)/100,
                sel: (parseFloat(data.nutriments.sel)*quantity*coef)/100
        }
    },
    
    completeTemplate(data){
        let template = {
          "cal_pdej":0,
          "lip_pdej":0,
          "glu_pdej":0,
          "sel_pdej":0,
          "prot_pdej":0,
          "cal_dej":0,
          "lip_dej":0,
          "glu_dej":0,
          "sel_dej":0,
          "prot_dej":0,
          "cal_din":0,
          "lip_din":0,
          "glu_din":0,
          "sel_din":0,
          "prot_din":0,
          "cal_jour":0,
          "lip_jour":0,
          "glu_jour":0,
          "sel_jour":0,
          "prot_jour":0,
          "alcool":0
        }
        data.forEach(x => {
            if ( x != "undefined" ){
            template[Object.keys(x)[0]]+=Object.values(x)[0]
            template[Object.keys(x)[1]]+=Object.values(x)[1]
            template[Object.keys(x)[2]]+=Object.values(x)[2]
            template[Object.keys(x)[3]]+=Object.values(x)[3]
            template[Object.keys(x)[4]]+=Object.values(x)[4]
            }
        })
        return template
    }
    
    
}

module.exports = foodService;