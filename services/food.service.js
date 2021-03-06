const database = require('../services/db.service')


var foodService = {
    
    /* Add gramme choice */
    calculAJR: function(data,days,callback){
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
                    case "collation":
                        return {
                                "cal_coll":nutriments.calories,
                                "lip_coll":nutriments.lipide,
                                "glu_coll":nutriments.glucide,
                                "sel_coll":nutriments.sel,
                                "prot_coll":nutriments.protein
                        }
                }
            }else{
                /*Les recettes mangées ne sont pas traité*/
                return "undefined"
            }
        })
        callback(foodService.completeTemplate(res,days))
    },
    
    calculProcessedFood(data){
        let coef = 1;
        let quantity = data.quantity;
        let custom_quantity = parseFloat(data.custom_quantity);
        if (custom_quantity){
            return {
                calories: (parseFloat(data.nutriments.calories)*custom_quantity)/100,
                lipide: (parseFloat(data.nutriments.lipide)*custom_quantity)/100,
                glucide: (parseFloat(data.nutriments.glucide)*custom_quantity)/100,
                protein: (parseFloat(data.nutriments.proteins)*custom_quantity)/100,
                sel: (parseFloat(data.nutriments.sel)*custom_quantity)/100
            }
        }else{
            if (quantity.match(/(litre|litres|Litres|kg|L|l)$/)){
            coef = 1000
            }
            quantity.replace(/[a-z|/ ]/g,'');
            quantity = parseFloat(quantity);
            return {
                    calories: (parseFloat(data.nutriments.calories)*quantity*coef)/100,
                    lipide: (parseFloat(data.nutriments.lipide)*quantity*coef)/100,
                    glucide: (parseFloat(data.nutriments.glucide)*quantity*coef)/100,
                    protein: (parseFloat(data.nutriments.proteins)*quantity*coef)/100,
                    sel: (parseFloat(data.nutriments.sel)*quantity*coef)/100
            }
        }
        
    },
    
    completeTemplate(data,days){
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
          "cal_coll":0,
          "lip_coll":0,
          "glu_coll":0,
          "prot_coll":0,
          "sel_coll":0,
          "prot_jour":0,
          "cal_jour":0,
          "lip_jour":0,
          "glu_jour":0,
          "sel_jour":0,
          "prot_jour":0,
          "alcool":0
        }
        data.forEach(x => {
            /*Il faut enlever le if*/
            if ( x != "undefined" ){
            template[Object.keys(x)[0]]+=Object.values(x)[0]
            template[Object.keys(x)[1]]+=Object.values(x)[1]
            template[Object.keys(x)[2]]+=Object.values(x)[2]
            template[Object.keys(x)[3]]+=Object.values(x)[3]
            template[Object.keys(x)[4]]+=Object.values(x)[4]
            template.cal_jour+=Object.values(x)[0]
            template.lip_jour+= (Object.values(x)[1]) ? Object.values(x)[1] : 0
            template.glu_jour+=Object.values(x)[2]
            template.sel_jour+=Object.values(x)[3]
            template.prot_jour+=Object.values(x)[4]
            }
        })
        for(key in template){
            template[key] = template[key]/days
        }
        return template
    }    
}

module.exports = foodService;