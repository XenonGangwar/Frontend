function closeItemshop(){
    mp.trigger("Client:CloseWeaponShop")
}

function buyItem(weapon){
    console.log(weapon);
    mp.trigger("Client:PurchaseWeapon", weapon)
}