function converToLocalTime(serverDate) {

    var dt = new Date(Date.parse(serverDate));
    var localDate = dt;

    var gmt = localDate;
        var min = gmt.getTime() / 1000 / 60; // convert gmt date to minutes
        var localNow = new Date().getTimezoneOffset(); // get the timezone
        // offset in minutes
        var localTime = min - localNow; // get the local time

    var dateStr = new Date(localTime * 1000 * 60);
    // dateStr = dateStr.toISOString("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"); // this will return as just the server date format i.e., yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
    dateStr = dateStr.toString("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    return dateStr;
}

export function timestamp(times){
    var today = new Date(times);
    today.setHours(today.getHours() + 9);
    return today.toISOString().replace('T', ' ').substring(0, 19);
}

export function ConvertToYYYYMMDDHHMM(times){
    var today = new Date(times);
    today.setHours(today.getHours() + 9);
    return today.toISOString().replace('T', ' ').substring(0, 17);
}
export function ConvertToYYYYMMDDhhmmtoKor(times){
    let today = new Date(times);
    today.setHours(today.getHours() + 9);
    let all = today.toISOString().replace('T', ' ').substring(0, 17);
    let year = all.substring(0,4);
    let month = all.substring(5,7);
    let day = all.substring(8,10);
    let hour = all.substring(11,13);
    let min = all.substring(14,16);

    return year + '년 ' + month + '월 ' + day + '일 ' + hour + '시 ' +min + '분 '
}
export function ConvertToYYYYMMDDhhmmsstoKor(times){
    let today = new Date(times);
    today.setHours(today.getHours() + 9);
    let all = today.toISOString().replace('T', ' ').substring(0, 19);
    let year = all.substring(0,4);
    let month = all.substring(5,7);
    let day = all.substring(8,10);
    let hour = all.substring(11,13);
    let min = all.substring(14,16);
    let second = all.substring(17,19);

    return year + '년 ' + month + '월 ' + day + '일 ' + hour + '시 ' +min + '분 ' +second + '초'
}
