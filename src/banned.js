import { publicIpv4 } from 'public-ip';

let bannedIPs = new Map()   //IP baneada --> fecha de baneo

function ban(ip){
    let banDate = new Date()
    bannedIPs.set(ip, banDate)
    console.log(bannedIPs)
}

function isBanned(ip){
    if (bannedIPs.has(ip)) {
        const banDate = bannedIPs.get(ip);
        const currentDate = new Date();
        const timeDifference = currentDate - banDate;  // Diferencia de tiempo en milisegundos

        // Convertir 20 días a milisegundos (20 días * 24 horas * 60 minutos * 60 segundos * 1000 milisegundos)
        const twentyDaysInMs = 20 * 24 * 60 * 60 * 1000;        //2 minutos seria 2 minutos * 60 segundos * 1000 milisegundos

        // Si han pasado más de 20 días, desbanear la IP
        if (timeDifference > twentyDaysInMs) {
            console.log(`La IP ${ip} ha sido desbaneada automáticamente después de 20 días.`);
            bannedIPs.delete(ip);  // Eliminar IP del baneo
            return false;  // La IP ya no está baneada
        } else {
            console.log(`La IP ${ip} está baneada desde: ${banDate}`);
            return true;  // La IP sigue baneada
        }
    } else {
        console.log(`La IP ${ip} no está baneada.`);
        return false;  // La IP no está baneada
    }
}

function unban(ip) {
    if (bannedIPs.delete(ip)) {
        console.log(`La IP ${ip} ha sido desbaneada manualmente.`);
    } else {
        console.log(`La IP ${ip} no estaba baneada.`);
    }
}

// Función para mostrar todas las IPs baneadas y sus fechas
function showBannedIPs() {
    console.log("IPs baneadas y fechas de baneo:");
    bannedIPs.forEach((banDate, ip) => {
        console.log(`IP: ${ip}, Baneada el: ${banDate}`);
    });
}

async function checkIfBanned(req, res, next) {            //Function acting as middleware
    const userIP = await publicIpv4();

    if (bannedIPs.has(userIP)) {
        // If the user's IP is banned, respond with a 403 Forbidden status
        return res.status(403).send('Your IP is banned');
    }
    //console.log('hello', userIP)
    // If the user is not banned, proceed to the next middleware or route
    next();
}

export { ban, isBanned, unban, showBannedIPs, checkIfBanned }