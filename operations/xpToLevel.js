const fs = require('fs');

module.exports = {
    name: "xp to level",
    description: "Converts a number of XP to",
    async execute (XP) {
        values = [3, 6, 10, 20, 30, 40, 50, 60, 80, 90, 110, 110, 130, 130, 150, 150, 170, 170, 190, 190, 210, 210, 230, 230, 0];
        i = 0;
        
        for (value of values) {
            if (value > 0) {
                XP = XP - (value * 5);
    
                if (XP >= 0) {
                    i++;
                }
                else {
                    return i;
                }
            }
            else {
                while (XP > 0) {
                    XP = XP - (250 * 5);
                    i++
                }
                return i;
            }
            
        }
    }
}
