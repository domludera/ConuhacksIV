function getEmis(dist, engSize){
	if(engSize<=1.4){
		return dist*0.17;
	}else if(engSize<=2.1){
		return dist*0.22;
	}else{
		return dist*0.27;
	}
}

var myEmis = getEmis(20,2.5);

console.log("Your CO2 Emission is %d Kg/L", myEmis);
