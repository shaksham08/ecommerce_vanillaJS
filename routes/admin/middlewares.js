
const { validationResult } = require("express-validator");

module.exports = {
    handleErrors(location, dataCb) {
        return async (req, res, next) => {
            const { errors } = validationResult(req);
            const errormsg = {};

            for (let error of errors) {
                errormsg[error.param] = error.msg;
            }

            if (errors.length > 0) {
                let data = {}
                if (dataCb) {
                    data = await dataCb(req)
                }
                return res.render(location, { errormsg, ...data });

            }
            next();
        }

    },
    requireAuth(req, res, next) {
        if (!req.session.userId) {
            return res.redirect("/signin");
        }
        next()
    }
}