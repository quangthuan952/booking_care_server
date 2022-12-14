import bcrypt from "bcryptjs"
import db from "../models/index"

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPasswordFromBcrypt = await hashPasswordUser(data.password)
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstname,
                lastName: data.lastname,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === 1,
                roleId: data.roleId
            })
            resolve('Create a new user successfully!')
        } catch (e) {
            reject(e)
        }
    })
}

let hashPasswordUser = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }
    })
}

let getAllUser = () => {
    return new Promise((resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true
            })
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}

let getUserInforById = async (userId) => {
    try {
        let user = await db.User.findOne({
            where: {id: userId},
            raw: true
        })
        if (user) {
            return user
        } else {
            return {}
        }
    } catch (e) {
        return e
    }
}

let updateUser = async (data) => {
    try {
        const user = await db.User.findOne({
            where: {id: data.id}
        })
        if (user) {
            user.firstName = data.firstname
            user.lastName = data.lastname
            user.address = data.address

            await user.save()
        } else {
            return ""
        }
    } catch (e) {
        return e
    }
}

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {id: userId}
            })
            await user.destroy()
            resolve()
        } catch (e) {
            reject(e)
        }
    })

}
module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInforById: getUserInforById,
    updateUser: updateUser,
    deleteUserById: deleteUserById
}