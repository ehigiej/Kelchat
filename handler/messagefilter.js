const moment = require("moment")

function formatMessage(username, text, imageSrc) {
    return {
        username,
        text,
        imageSrc,
        time: moment().format("h:mm a")
    }
}

module.exports = formatMessage