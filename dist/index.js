"use strict";

var _clsHooked = _interopRequireDefault(require("cls-hooked"));

var jsdiff = _interopRequireWildcard(require("diff"));

var _lodash = _interopRequireDefault(require("lodash"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _helpers = _interopRequireDefault(require("./helpers"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let failHard = false;

exports.init = (sequelize, optionsArg) => {
  // In case that options is being parsed as a readonly attribute.
  // Or it is not passed at all
  const optsArg = _lodash.default.cloneDeep(optionsArg || {});

  const defaultOptions = {
    debug: false,
    log: null,
    exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt', 'created_at', 'updated_at', 'deleted_at', 'revision'],
    revisionAttribute: 'revision',
    revisionModel: 'Revision',
    revisionChangeModel: 'RevisionChange',
    enableRevisionChangeModel: false,
    UUID: false,
    underscored: false,
    underscoredAttributes: false,
    defaultAttributes: {
      documentId: 'documentId',
      revisionId: 'revisionId'
    },
    userModel: false,
    userModelAttribute: 'userId',
    enableCompression: false,
    enableMigration: false,
    enableStrictDiff: true,
    continuationNamespace: null,
    continuationKey: 'userId',
    metaDataFields: null,
    metaDataContinuationKey: 'metaData',
    documentFieldType: 'mysql'
  };
  let ns = null;

  if (optsArg.continuationNamespace) {
    console.log('namespace?', optsArg.continuationNamespace);
    ns = _clsHooked.default.getNamespace(optsArg.continuationNamespace);
    console.log('what is this BEGINNING', ns.get('userId'));

    if (!ns) {
      console.log('we created it :(');
      ns = _clsHooked.default.createNamespace(optsArg.continuationNamespace);
    }
  }

  if (optsArg.underscoredAttributes) {
    _helpers.default.toUnderscored(defaultOptions.defaultAttributes);
  } // keep the compatibility with old project


  if (optsArg.mysql && !optsArg.documentFieldType) {
    optsArg.documentFieldType = 'legacy';
  }

  const options = _lodash.default.defaults(optsArg, defaultOptions); // if (optionsArg.defaultAttributes) {
  // 	if (optionsArg.defaultAttributes.documentId) {
  // 		defaultAttributes.documentId =
  // 			optionsArg.defaultAttributes.documentId;
  // 	}
  // 	if (optionsArg.defaultAttributes.revisionId) {
  // 		defaultAttributes.revisionId =
  // 			optionsArg.defaultAttributes.revisionId;
  // 	}
  // }
  // // if no options are passed the function
  // if (!options) options = {};
  // enable debug logging
  // let debug = false;
  // const { debug } = options;
  // TODO: implement logging option


  const log = options.log || console.log; // show the current sequelize and options objects
  // if (options.debug) {
  // 	// log('sequelize object:');
  // 	// log(sequelize);
  // 	log('options object:');
  // 	log(options);
  // }
  // // attribute name for revision number in the models
  // if (!options.revisionAttribute) {
  // 	options.revisionAttribute = 'revision';
  // }
  // // fields we want to exclude from audit trails
  // if (!options.exclude) {
  // 	options.exclude = [
  // 		'id',
  // 		'createdAt',
  // 		'updatedAt',
  // 		'deletedAt', // if the model is paranoid
  // 		'created_at',
  // 		'updated_at',
  // 		'deleted_at',
  // 		options.revisionAttribute,
  // 	];
  // }
  // // model name for revision table
  // if (!options.revisionModel) {
  // 	options.revisionModel = 'Revision';
  // }
  // // model name for revision changes tables
  // if (!options.revisionChangeModel) {
  // 	options.revisionChangeModel = 'RevisionChange';
  // }
  // if (!options.enableRevisionChangeModel) {
  // 	options.enableRevisionChangeModel = false;
  // }
  // // support UUID for postgresql
  // if (options.UUID === undefined) {
  // 	options.UUID = false;
  // }
  // // underscored created and updated attributes
  // if (!options.underscored) {
  // 	options.underscored = false;
  // }
  // if (!options.underscoredAttributes) {
  // 	options.underscoredAttributes = false;
  // 	options.defaultAttributes = defaultAttributes;
  // } else {
  // 	options.defaultAttributes = helpers.toUnderscored(defaultAttributes);
  // }
  // // To track the user that made the changes
  // if (!options.userModel) {
  // 	options.userModel = false;
  // }
  // // full revisions or compressed revisions (track only the difference in models)
  // // default: full revisions
  // if (!options.enableCompression) {
  // 	options.enableCompression = false;
  // }
  // // add the column to the database if it doesn't exist
  // if (!options.enableMigration) {
  // 	options.enableMigration = false;
  // }
  // // enable strict diff
  // // when true: 10 !== '10'
  // // when false: 10 == '10'
  // // default: true
  // if (!options.enableStrictDiff) {
  // 	options.enableStrictDiff = true;
  // }
  // let ns;
  // if (options.continuationNamespace) {
  // 	ns = cls.getNamespace(options.continuationNamespace);
  // 	if (!ns) {
  // 		ns = cls.createNamespace(options.continuationNamespace);
  // 	}
  // 	if (!options.continuationKey) {
  // 		options.continuationKey = 'userId';
  // 	}
  // }
  // if (options.debug) {
  // 	log('parsed options:');
  // 	log(options);
  // }

  function createBeforeHook(operation) {
    const beforeHook = function beforeHook(instance, opt) {
      if (options.debug) {
        log('beforeHook called');
        log('instance:', instance);
        log('opt:', opt);
      }

      if (opt.noPaperTrail) {
        if (options.debug) {
          log('noPaperTrail opt: is true, not logging');
        }

        return;
      }

      const destroyOperation = operation === 'destroy';
      let previousVersion = {};
      let currentVersion = {};

      if (!destroyOperation && options.enableCompression) {
        _lodash.default.forEach(opt.defaultFields, a => {
          previousVersion[a] = instance._previousDataValues[a];
          currentVersion[a] = instance.dataValues[a];
        });
      } else {
        previousVersion = instance._previousDataValues;
        currentVersion = instance.dataValues;
      } // Supported nested models.
      // previousVersion = _.omitBy(
      // 	previousVersion,
      // 	i => i != null && typeof i === 'object' && !(i instanceof Date),
      // );


      previousVersion = _lodash.default.pick(previousVersion, Object.keys(instance.rawAttributes));
      previousVersion = _lodash.default.omit(previousVersion, options.exclude); // currentVersion = _.omitBy(
      // 	currentVersion,
      // 	i => i != null && typeof i === 'object' && !(i instanceof Date),
      // );

      currentVersion = _lodash.default.pick(currentVersion, Object.keys(instance.rawAttributes));
      currentVersion = _lodash.default.omit(currentVersion, options.exclude); // Get diffs

      const delta = _helpers.default.calcDelta(previousVersion, currentVersion, options.exclude, options.enableStrictDiff);

      if (options.debug) {
        log('delta:', delta);
      } // Check if all required fields have been provided to the opts / CLS


      if (options.metaDataFields) {
        // get all required field keys as an array
        const requiredFields = _lodash.default.keys(_lodash.default.pickBy(options.metaDataFields, function isMetaDataFieldRequired(required) {
          return required;
        }));

        if (requiredFields && requiredFields.length) {
          const metaData = ns && ns.get(options.metaDataContinuationKey) || opt.metaData;

          const requiredFieldsProvided = _lodash.default.filter(requiredFields, function isMetaDataFieldNonUndefined(field) {
            return metaData[field] !== undefined;
          });

          if (requiredFieldsProvided.length !== requiredFields.length) {
            log('Required fields: ', options.metaDataFields, requiredFields);
            log('Required fields provided: ', metaData, requiredFieldsProvided);
            throw new Error('Not all required fields are provided to paper trail!');
          }
        }
      }

      if (destroyOperation || delta && delta.length > 0) {
        if (!instance.context) {
          instance.context = {};
        }

        instance.context.delta = delta;
      }

      if (options.debug) {
        log('end of beforeHook');
      }
    };

    return beforeHook;
  }

  function createAfterHook(operation) {
    const afterHook = function afterHook(instance, opt) {
      if (options.debug) {
        log('afterHook called');
        log('instance:', instance);
        log('opt:', opt);

        if (ns) {
          log(`CLS ${options.continuationKey}:`, ns.get(options.continuationKey));
        }
      }

      const destroyOperation = operation === 'destroy';

      if (instance.context && (instance.context.delta && instance.context.delta.length > 0 || destroyOperation)) {
        const Revision = sequelize.model(options.revisionModel);
        let RevisionChange;

        if (options.enableRevisionChangeModel) {
          RevisionChange = sequelize.model(options.revisionChangeModel);
        }

        const {
          delta
        } = instance.context;
        let previousVersion = {};
        let currentVersion = {};

        if (!destroyOperation && options.enableCompression) {
          _lodash.default.forEach(opt.defaultFields, a => {
            previousVersion[a] = instance._previousDataValues[a];
            currentVersion[a] = instance.dataValues[a];
          });
        } else {
          previousVersion = instance._previousDataValues;
          currentVersion = instance.dataValues;
        } // Supported nested models.
        // previousVersion = _.omitBy(
        // 	previousVersion,
        // 	i =>
        // 		i != null &&
        // 		typeof i === 'object' &&
        // 		!(i instanceof Date),
        // );


        previousVersion = _lodash.default.pick(previousVersion, Object.keys(instance.rawAttributes));
        previousVersion = _lodash.default.omit(previousVersion, options.exclude); // currentVersion = _.omitBy(
        // 	currentVersion,
        // 	i =>
        // 		i != null &&
        // 		typeof i === 'object' &&
        // 		!(i instanceof Date),
        // );

        currentVersion = _lodash.default.pick(currentVersion, Object.keys(instance.rawAttributes));
        currentVersion = _lodash.default.omit(currentVersion, options.exclude);

        if (failHard && ns && !ns.get(options.continuationKey)) {
          throw new Error(`The CLS continuationKey ${options.continuationKey} was not defined.`);
        }

        let document = currentVersion;

        if (options.documentFieldType === 'legacy') {
          document = JSON.stringify(document);
        } // Build revision


        const query = {
          model: this.name,
          document,
          operation
        }; // if the usermodel is enabled build the sequelize model with the user model attribute

        if (options.userModel) {
          ns && console.log('what is this', ns.get('userId'));
          query[options.userModelAttribute] = ns && ns.get('userId') || opt.userId;
        } // Add all extra data fields to the query object


        if (options.metaDataFields) {
          const metaData = ns && ns.get(options.metaDataContinuationKey) || opt.metaData;

          if (metaData) {
            _lodash.default.forEach(options.metaDataFields, function getMetaDataValues(required, field) {
              const value = metaData[field];

              if (options.debug) {
                log(`Adding metaData field to Revision - ${field} => ${value}`);
              }

              if (!(field in query)) {
                query[field] = value;
              } else if (options.debug) {
                log(`Revision object already has a value at ${field} => ${query[field]}`);
                log('Not overwriting the original value');
              }
            });
          }
        } // in case of custom user models that are not 'userId'


        query[options.defaultAttributes.documentId] = instance.id;
        const revision = Revision.build(query); // Save revision

        return revision.save({
          transaction: opt.transaction
        }).then(objectRevision => {
          // Loop diffs and create a revision-diff for each
          if (options.enableRevisionChangeModel) {
            _lodash.default.forEach(delta, difference => {
              const o = _helpers.default.diffToString(difference.item ? difference.item.lhs : difference.lhs);

              const n = _helpers.default.diffToString(difference.item ? difference.item.rhs : difference.rhs); // let document = difference;


              document = difference;
              let diff = o || n ? jsdiff.diffChars(o, n) : [];

              if (options.documentFieldType === 'legacy') {
                document = JSON.stringify(document);
                diff = JSON.stringify(diff);
              }

              const d = RevisionChange.build({
                path: difference.path[0],
                document,
                diff,
                revisionId: objectRevision.id
              });
              d.save({
                transaction: opt.transaction
              }).then(savedD => {
                // Add diff to revision
                objectRevision[`add${_helpers.default.capitalizeFirstLetter(options.revisionChangeModel)}`](savedD);
                return null;
              }).catch(err => {
                log('RevisionChange save error', err);
                throw err;
              });
            });
          }

          return null;
        }).catch(err => {
          log('Revision save error', err);
          throw err;
        });
      }

      if (options.debug) {
        log('end of afterHook');
      }

      return null;
    };

    return afterHook;
  } // order in which sequelize processes the hooks
  // (1)
  // beforeBulkCreate(instances, options, fn)
  // beforeBulkDestroy(instances, options, fn)
  // beforeBulkUpdate(instances, options, fn)
  // (2)
  // beforeValidate(instance, options, fn)
  // (-)
  // validate
  // (3)
  // afterValidate(instance, options, fn)
  // - or -
  // validationFailed(instance, options, error, fn)
  // (4)
  // beforeCreate(instance, options, fn)
  // beforeDestroy(instance, options, fn)
  // beforeUpdate(instance, options, fn)
  // (-)
  // create
  // destroy
  // update
  // (5)
  // afterCreate(instance, options, fn)
  // afterDestroy(instance, options, fn)
  // afterUpdate(instance, options, fn)
  // (6)
  // afterBulkCreate(instances, options, fn)
  // afterBulkDestroy(instances, options, fn)
  // afterBulkUpdate(instances, options, fn)
  // Extend model prototype with "hasPaperTrail" function
  // Call model.hasPaperTrail() to enable revisions for model


  _lodash.default.assignIn(_sequelize.default.Model, {
    hasPaperTrail: function hasPaperTrail() {
      if (options.debug) {
        log('Enabling paper trail on', this.name);
      }

      this.revisionable = true; // not sure if we need this

      this.refreshAttributes();
      this.addHook('beforeCreate', createBeforeHook('create'));
      this.addHook('beforeDestroy', createBeforeHook('destroy'));
      this.addHook('beforeUpdate', createBeforeHook('update'));
      this.addHook('afterCreate', createAfterHook('create'));
      this.addHook('afterDestroy', createAfterHook('destroy'));
      this.addHook('afterUpdate', createAfterHook('update')); // create association

      return this.hasMany(sequelize.models[options.revisionModel], {
        foreignKey: options.defaultAttributes.documentId,
        constraints: false,
        scope: {
          model: this.name
        }
      });
    }
  });

  return {
    // Return defineModels()
    defineModels: function defineModels(db) {
      // Attributes for RevisionModel
      let attributes = {
        model: {
          type: _sequelize.default.TEXT,
          allowNull: false
        },
        document: {
          type: _sequelize.default.JSONB,
          allowNull: false
        },
        operation: _sequelize.default.STRING(7),
        createdAt: {
          type: _sequelize.default.DATE,
          defaultValue: _sequelize.default.NOW
        }
      };

      if (options.userModel) {
        attributes.userId = {
          type: _sequelize.default.INTEGER,
          allowNull: true
        };
      }

      if (options.documentFieldType === 'legacy') {
        attributes.document.type = _sequelize.default.TEXT('MEDIUMTEXT');
      } else if (options.documentFieldType === 'mysql') {
        attributes.document.type = _sequelize.default.JSON;
      }

      attributes[options.defaultAttributes.documentId] = {
        type: _sequelize.default.INTEGER,
        allowNull: false
      };

      if (options.UUID) {
        attributes.id = {
          primaryKey: true,
          type: _sequelize.default.UUID,
          defaultValue: _sequelize.default.UUIDV4
        };
        attributes[options.defaultAttributes.documentId].type = _sequelize.default.UUID;
      }

      if (options.debug) {
        log('Revision attributes', attributes);
      } // Revision model


      const Revision = sequelize.define(options.revisionModel, attributes, {
        underscored: options.underscored,
        tableName: options.tableName
      });

      Revision.associate = function associate(models) {
        if (options.debug) {
          log('models', models);
        }

        Revision.belongsTo(sequelize.model(options.userModel), options.belongsToUserOptions);
      };

      if (options.enableRevisionChangeModel) {
        // Attributes for RevisionChangeModel
        attributes = {
          path: {
            type: _sequelize.default.TEXT,
            allowNull: false
          },
          document: {
            type: _sequelize.default.JSONB,
            allowNull: false
          },
          diff: {
            type: _sequelize.default.JSONB,
            allowNull: false
          }
        };

        if (options.documentFieldType === 'legacy') {
          attributes.document.type = _sequelize.default.TEXT('MEDIUMTEXT');
          attributes.diff.type = _sequelize.default.TEXT('MEDIUMTEXT');
        } else if (options.documentFieldType === 'mysql') {
          attributes.document.type = _sequelize.default.JSON;
          attributes.diff.type = _sequelize.default.JSON;
        }

        if (options.UUID) {
          attributes.id = {
            primaryKey: true,
            type: _sequelize.default.UUID,
            defaultValue: _sequelize.default.UUIDV4
          };
        }

        if (options.debug) {
          log('RevisionChange attributes', attributes);
        } // RevisionChange model


        const RevisionChange = sequelize.define(options.revisionChangeModel, attributes, {
          underscored: options.underscored
        }); // Set associations

        Revision.hasMany(RevisionChange, {
          foreignKey: options.defaultAttributes.revisionId,
          constraints: false
        }); // https://github.com/nielsgl/sequelize-paper-trail/issues/10
        // RevisionChange.belongsTo(Revision, {
        // 	foreignKey: options.defaultAttributes.revisionId,
        // });

        RevisionChange.belongsTo(Revision, {
          foreignKey: options.defaultAttributes.revisionId
        });
        if (db) db[RevisionChange.name] = RevisionChange;
      }

      if (db) db[Revision.name] = Revision;
      /*
       * We could extract this to a separate function so that having a
       * user model doesn't require different loading
       *
       * or perhaps we could omit this because we are creating the
       * association through the associate call above.
       */
      // if (options.userModel) {
      // 	Revision.belongsTo(
      // 		sequelize.model(options.userModel),
      // 		options.belongsToUserOptions,
      // 	);
      // }

      return Revision;
    }
  };
};
/**
 * Throw exceptions when the user identifier from CLS is not set or if the
 * revisionAttribute was not loaded on the model.
 */


exports.enableFailHard = () => {
  failHard = true;
};

module.exports = exports;