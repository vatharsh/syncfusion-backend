const express = require("express");

const router = express.Router();

const SyncFusionController = require('../controllers/syncfusion');

router.get("/getJsonSampleData",SyncFusionController.getJsonSampleData);
router.put("/updateHeaderColumnName",SyncFusionController.updateHeaderColumnName);
router.put("/addHeaderColumnName",SyncFusionController.addHeaderColumnName);
router.put("/removeHeaderColumnName",SyncFusionController.removeHeaderColumnName);
router.put("/addHeaderColumnObject",SyncFusionController.addHeaderColumnObject);
router.put("/updateHeaderColumnObject",SyncFusionController.updateHeaderColumnObject);
router.put("/removeHeaderColumnObject",SyncFusionController.removeHeaderColumnObject);
router.put("/dragDropRows",SyncFusionController.dragDropRows);
router.put("/addRowNext",SyncFusionController.addRowNext);
router.put("/addRowChild",SyncFusionController.addRowChild);
router.put("/deleteRow",SyncFusionController.deleteRow);
router.put("/updateRow",SyncFusionController.updateRow);
router.put("/pasteRowDataNext",SyncFusionController.pasteRowDataNext);
router.put("/pasteRowDataChild",SyncFusionController.pasteRowDataChild);
router.put("/pasteRowDataTop",SyncFusionController.pasteRowDataTop);
router.put("/dragDropColumn",SyncFusionController.dragDropColumn);

module.exports = router;
