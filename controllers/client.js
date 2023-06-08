const { validationResult } = require("express-validator");
const Client = require("../models/client");
const User = require("../models/user");
const Place = require("../models/place");

exports.getClients = async (req, res, next) => {
  let clients = [];

  let queryObject = {};

  let categoryId = req.query.categoryId;

  if (categoryId !== undefined) {
    queryObject.categoryId = categoryId;
  }

  let totalItems = 0;

  try {
    clients = await Client.findAll({ where: queryObject });

    totalItems = clients.length;
    res.status(200).json({
      clients: clients,
      totalItems: totalItems,
    });
  } catch (error) {
    next(error);
  }
};

exports.getClient = async (req, res, next) => {
  const clientId = req.params.clientId;
  try {
    const client = await Client.findByPk(clientId);
    if (!client) {
      const error = new Error("This client does not exist.");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      client: client,
    });
  } catch (error) {
    if (!error) {
      error.statusCode = 500;
    }

    next(error);
  }
};

exports.createClient = async (req, res, next) => {
    const errors = validationResult(req);

    if(!req.isOwner) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        next(error);
    }

    try{
        if(!errors.isEmpty()) {
            const error = new Error("Validation failed, entered data is incorrect.");
            error.status = 422;
            error.data = errors.array();
            throw error;
        }

    }catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
        return;
    }

    const placeId = req.body.placeId;
    const clientId  = req.body.userId;
    const confirm = 0;

    try {
        const user = await User.findByPk(clientId);
        if(!user) {
            const error = new Error("User does not exist!");
            error.statusCode = 400;
            throw error;
        }
        const place = await Place.findByPk(placeId);
        if(!place) {
            const error = new Error("Place does not exist!");
            error.statusCode = 400;
            throw error;
        }

        console.log(place)

        if(place.userId !== req.userId) {
            const error = new Error("Place does not belong to you!");
            error.statusCode = 400;
            throw error;
        }

        const client = await Client.create({
            userId: clientId,
            placeId: placeId,
            confirm: confirm
        });

        res.status(200).json({
            client: client
        })
    } catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
        return;
    }
};

exports.editClient = async (req, res, next) => {
    const errors = validationResult(req);

    try{
        if(!errors.isEmpty()) {
            const error = new Error("Validation failed, entered data is incorrect.");
            error.status = 422;
            error.data = errors.array();
            throw error;
        }

        const client = await Client.findByPk(req.params.clientId);
      

        if(!client) {
            const error = new Error("This client does not exist!");
            error.statusCode = 400;
            throw error;
        }
  
        console.log(req.userId === client.userId);

        if(client.userId !== req.userId) {
            const error = new Error("Unauthorized!");
            error.statusCode = 403;
            throw error;
        }

        client.confirm = 1;
        
        await client.save();
      
        res.status(200).json({
            client: client
        })
    }catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
        return;
    }


};

exports.deleteClient = async (req, res, next) => {
    const clientId = req.params.clientId;
    try {
        const client = await Client.findByPk(clientId);

        if(!client) {
            const error = new Error("This client does not exist!");
            error.statusCode = 404;
            throw error;
        }

        const place = await Place.findByPk(client.placeId);

        if(place.userId !== req.userId) {
            const error = new Error("Not authorized!");
            error.statusCode = 403;
            throw error;
        }

        await client.destroy();

        res.status(200).json({message: "Deleted client!"});
    }catch(error) {
        if(!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};
