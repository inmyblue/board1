const sanitizeHtml = require("sanitize-html")
const sanitizeOption = {
    allowedTags : [
        'h1',
        'h2',
        'b',
        'i',
        'u',
        's',
        'p',
        'ul',
        'ol',
        'li',
        'blockquote',
        'a',
        'img',
    ],
    allowedAttributes : {
        a : ['href', 'name', 'target'],
        img : ['src'],
        li : ['class'],
    },
    allowedSchemes : ['data', 'http'],
};

exports.sanitizer = (req, res, next) => {
    const {title, userName, content} = req.body

    req.body.title = sanitizeHtml(title,{...sanitizeOption})
    req.body.userName = sanitizeHtml(userName,{...sanitizeOption})
    req.body.content = sanitizeHtml(content,{...sanitizeOption})    
    next();
}