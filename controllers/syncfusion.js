const fs = require('fs');
var promise = require('promise');
const jsonData = require("../dataset/sample-data.json");
var objFound = false;
var counter = 0;

const isDate = (date) => {
      return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

function addToObject (obj, key, value, index) {
      // Create a temp object and index variable
      var temp = {};
      var i = 0;
      // Loop through the original object
      for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {

                  // If the indexes match, add the new item
                  if (i === index && key && value) {
                        temp[key] = value;
                  }

                  // Add the current item in the loop to the temp obj
                  temp[prop] = obj[prop];

                  // Increase the count
                  i++;

            }
      }

      // If no index, add to the end
      if (!index && key && value) {
            temp[key] = value;
      }
      
      return temp;

}

function jsonReader(filePath, cb) {
      fs.readFile(filePath, (err, fileData) => {
          if (err) {
              return cb && cb(err)
          }
          try {
              const object = JSON.parse(fileData)
              return cb && cb(null, object)
          } catch(err) {
              return cb && cb(err)
          }
      })
}

exports.getJsonSampleData = (req,res,next)=>{
        jsonReader(__dirname + '/../dataset/sample-data.json', (err, jsonString) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                  message: err
              });
            } else {
                  //addFiftyThousandDummyRecords();
                   res.status(200).json({
                        message: "success",
                        data : jsonString
                  });
                  
                  
            }
        });
      
}

//start - obsolete code
exports.updateHeaderColumnName = (req,res,next)=>{
      //console.log(req.body);
      var id = req.body.id;
      var colName = req.body.colName;
      jsonReader(__dirname + '/../dataset/sample-data.json', (err, jsonString) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                  message: err
              });
            }
            else {
                  jsonString.treegrid.headers[id] = colName;
                  fs.writeFile(__dirname + '/../dataset/sample-data.json', JSON.stringify(jsonString), (err) => {
                        if (err) {
                              console.log('Error writing file:', err)
                              res.status(500).json({
                                    message: err
                                });
                        }
                        else {
                              res.status(200).json({
                                    message: "success"
                              });
                        }
                    })
            }
        })
}

exports.addHeaderColumnName = (req,res,next)=>{
    var id = req.body.id;
    var colName = req.body.colName;
    jsonReader(__dirname + '/../dataset/sample-data.json', (err, jsonString) => {
          if (err) {
              console.log(err)
              res.status(500).json({
                message: err
            });
          }
          else {
               jsonString.treegrid.headers.splice(parseInt(id)+1, 0, colName);
                fs.writeFile(__dirname + '/../dataset/sample-data.json', JSON.stringify(jsonString), (err) => {
                      if (err) {
                            console.log('Error writing file:', err)
                            res.status(500).json({
                                  message: err
                              });
                      }
                      else {
                            res.status(200).json({
                                  message: "success"
                            });
                      }
                  })
          }
      })
}

exports.removeHeaderColumnName = (req,res,next)=>{
    var id = req.body.id;
    jsonReader(__dirname + '/../dataset/sample-data.json', (err, jsonString) => {
          if (err) {
              console.log(err)
              res.status(500).json({
                message: err
            });
          }
          else {
            //var colName = jsonString.treegrid.headers[id].name;
            jsonString.treegrid.headers.splice(index, 1);
            fs.writeFile(__dirname + '/../dataset/sample-data.json', JSON.stringify(jsonString), (err) => {
                  if (err) {
                        console.log('Error writing file:', err)
                        res.status(500).json({
                              message: err
                          });
                  }
                  else {
                        res.status(200).json({
                              message: "success"
                        });
                  }
            });
            
          }
      })
}
//end - obsolete code

exports.addHeaderColumnObject = (req,res,next)=>{
      var id = req.body.id;
      var headerColumnObj = JSON.parse(req.body.obj);
      jsonReader(__dirname + '/../dataset/sample-data.json', (err, jsonString) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                  message: err
              });
            }
            else {
                 jsonString.treegrid.headers.splice(parseInt(id)+1, 0, headerColumnObj);
                 addNewColumnWithData(jsonString,parseInt(id),headerColumnObj,res);
            }
        })
}

exports.updateHeaderColumnObject = (req,res,next)=>{
      var id = req.body.id;
      var headerColumnObj = JSON.parse(req.body.obj);
      jsonReader(__dirname + '/../dataset/sample-data.json', (err, jsonString) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                  message: err
              });
            }
            else {
                 var oldHeaderObj = {...jsonString.treegrid.headers[id]};
                 jsonString.treegrid.headers[id] = headerColumnObj;
                 updateNewColumnWithData(jsonString,parseInt(id),headerColumnObj,oldHeaderObj,res);
            }
        })
}

exports.removeHeaderColumnObject = (req,res,next)=>{
      //console.log(req.body);
      var id = req.body.id;
      jsonReader(__dirname + '/../dataset/sample-data.json', (err, jsonString) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                  message: err
              });
            }
            else {
              var colName = jsonString.treegrid.headers[id].name;
              jsonString.treegrid.headers.splice(id, 1);
              removeColumnWithData(jsonString,id,colName,res);
              
            }
        })
}

exports.dragDropRows= (req,res,next)=>{
      var dragDropEventObj = req.body.dragDropEvent;
      var dragDropEventObjData = dragDropEventObj.dragDropEventObjData;
      var dropIndex= dragDropEventObj.dropIndex ;
      var fromIndex=dragDropEventObj.fromIndex;
      var target = dragDropEventObj.target;
      var dropPosition = dragDropEventObj.dropPosition;
      //console.log(dragDropEventObjData);
      

      jsonReader(__dirname + '/../dataset/sample-data.json', (err, jsonString) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                  message: err
              });
            }
            else {
                  var dropIndexCounter = 0;
                  findIndexToAppendDragAndDropRows(jsonString.data,dropIndex,dropIndexCounter,(index,ele)=>{
                        objFound = false;
                        //appendDragDropRowData(dragDropEventObjData,ele,index,dropIndex,jsonString.data,dropPosition);
                        //removeDragDropRowDataOnceMoved(jsonString.data,dragDropEventObjData);
                  });
                  res.status(200).json({
                        message: "success",
                        data : jsonString.data
                  });
            }
      });
      
}

exports.addRowNext = (req,res,next) => {
      // console.log(req.body);
      //var addRowEventObj = req.body.addRowEvent;
      var newRowObj = req.body.newRowObj;
      var selectedRowObject = req.body.selectedRowObj;
      // console.log(selectedRowObject);
      var selectedRowId = selectedRowObject.data.TaskID;
      jsonReader(__dirname + '/../dataset/sample-data.json', (err, jsonString) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                  message: err
              });
            }
            else {
                  addRowNext(jsonString,selectedRowId,newRowObj,res);
            }
      });
      
}

exports.addRowChild = (req,res,next) => {
      var newRowObj = req.body.newRowObj;
      var selectedRowObject = req.body.selectedRowObj;
      var selectedRowId = selectedRowObject.data.TaskID;
      jsonReader(__dirname + '/../dataset/sample-data.json', (err, jsonString) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                  message: err
              });
            }
            else {
                  addRowChild(jsonString,selectedRowId,newRowObj,res);
            }
      });
      
}

exports.deleteRow= (req,res,next) => {
      var selectedRowObjects = req.body.selectedRowObjs;
      //var selectedRowId = selectedRowObject.data.TaskID;
      jsonReader(__dirname + '/../dataset/sample-data.json', (err, jsonString) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                  message: err
              });
            }
            else {
                  selectedRowObjects.forEach(element => {
                        //console.log(element.data.TaskID);
                        var selectedRowId = element.data.TaskID;
                        deleteRow(jsonString,selectedRowId,null);
                  });
                  fs.writeFile(__dirname + '/../dataset/sample-data.json', JSON.stringify(jsonString), (err) => {
                        if (err) {
                              console.log('Error writing file:', err)
                              res.status(500).json({
                                    message: err
                              });
                        }
                        else {
                        socket.broadcast.emit("TreeGrid data modified","CODE:x000SX1");
                              res.status(200).json({
                                    message: "success"
                              });
                        }
                  });
                  //deleteRow(jsonString,selectedRowId,res);
            }
      });
      
}

exports.updateRow = (req,res,next) => {
      var modifyRowObj = req.body.modifyRowObj;
      var modifiedRowId = req.body.taskId;
      jsonReader(__dirname + '/../dataset/sample-data.json', (err, jsonString) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                  message: err
              });
            }
            else {
                  updateRow(jsonString,modifiedRowId,modifyRowObj,res).then((data)=>{
                        fs.writeFile(__dirname + '/../dataset/sample-data.json', JSON.stringify(jsonString), (err) => {
                              if (err) {
                                    console.log('Error writing file:', err)
                                    res.status(500).json({
                                          message: err
                                      });
                              }
                              else {
                                   socket.broadcast.emit("TreeGrid data modified","CODE:x000SX1");
                                    res.status(200).json({
                                          message: "success"
                                    });
                              }
                          });
                  }).catch(()=>{
                        res.status(500).json({
                              message: err
                          });
                  });
            }
      });
      
}

exports.pasteRowDataTop = (req,res,next) => {
      // console.log(req.body);
      var rowsObj = req.body.rowsObj;
      var selectedRowId = req.body.taskId;
      var mode = req.body.mode;
      jsonReader(__dirname + '/../dataset/sample-data.json', (err, jsonString) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                  message: err
              });
            }
            else {
                  for(var i=0;i<rowsObj.length;i++) {
                        var dataSet = typeof(rowsObj[i].data)!="undefined" ? rowsObj[i].data.taskData : rowsObj[i].taskData;
                        counter = jsonString.key; 
                        // console.log(dataSet);
                        // console.log(selectedRowId);
                        if(mode =='copy') {
                              generateAndUpdateNewIds([dataSet],(index,element,obj)=>{
                                    obj[index]= element;
                                    jsonString.key = counter;
                                    //console.log(newKey);
                              });
                        } 
                        pasteRowTop(jsonString,String(selectedRowId).slice(),dataSet,jsonString.key,mode,res);
                  }
                  fs.writeFile(__dirname + '/../dataset/sample-data.json', JSON.stringify(jsonString), (err) => {
                        if (err) {
                              console.log('Error writing file:', err)
                              res.status(500).json({
                                    message: err
                                });
                        }
                        else {
                              socket.broadcast.emit("TreeGrid data modified","CODE:x000SX1");
                              res.status(200).json({
                                    message: "success"
                              });
                        }
                    });
            }
      });
      
}

exports.pasteRowDataNext = (req,res,next) => {
      // console.log(req.body);
      var rowsObj = req.body.rowsObj;
      var selectedRowId = req.body.taskId;
      var mode = req.body.mode;
      jsonReader(__dirname + '/../dataset/sample-data.json', (err, jsonString) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                  message: err
              });
            }
            else {
                  //addRowNext(jsonString,selectedRowId,newRowObj,res);
                  console.log(rowsObj.length);
                  for(var i=0;i<rowsObj.length;i++) {
                        var dataSet = typeof(rowsObj[i].data)!="undefined" ? rowsObj[i].data.taskData : rowsObj[i].taskData;
                        counter = jsonString.key; 
                        if(mode =='copy') {
                              generateAndUpdateNewIds([dataSet],(index,element,obj)=>{
                                    obj[index]= element;
                                    jsonString.key = counter;
                                    //console.log(newKey);
                              });
                        } 
                        pasteRowNext(jsonString,selectedRowId,dataSet,jsonString.key,mode,res);
                  }
                  fs.writeFile(__dirname + '/../dataset/sample-data.json', JSON.stringify(jsonString), (err) => {
                        if (err) {
                              console.log('Error writing file:', err)
                              res.status(500).json({
                                    message: err
                                });
                        }
                        else {
                             socket.broadcast.emit("TreeGrid data modified","CODE:x000SX1");
                              res.status(200).json({
                                    message: "success"
                              });
                        }
                    });
            }
      });
      
}

exports.pasteRowDataChild = (req,res,next) => {
      // console.log(req.body);
      var rowsObj = req.body.rowsObj;
      var selectedRowId = req.body.taskId;
      var mode = req.body.mode;
      jsonReader(__dirname + '/../dataset/sample-data.json', (err, jsonString) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                  message: err
              });
            }
            else {
                  //addRowNext(jsonString,selectedRowId,newRowObj,res);
                  for(var i=0;i<rowsObj.length;i++) {
                        var dataSet = typeof(rowsObj[i].data)!="undefined" ? rowsObj[i].data.taskData : rowsObj[i].taskData;
                        counter = jsonString.key; 
                        if(mode =='copy') {
                              generateAndUpdateNewIds([dataSet],(index,element,obj)=>{
                                    obj[index]= element;
                                    jsonString.key = counter;
                              });
                        }
                        pasteRowChild(jsonString,selectedRowId,dataSet,jsonString.key,mode,res);
                              
                  }

                  fs.writeFile(__dirname + '/../dataset/sample-data.json', JSON.stringify(jsonString), (err) => {
                        if (err) {
                              console.log('Error writing file:', err)
                              res.status(500).json({
                                    message: err
                                });
                        }
                        else {
                             socket.broadcast.emit("TreeGrid data modified","CODE:x000SX1");
                              res.status(200).json({
                                    message: "success"
                              });
                        }
                    });
            }
      });
      
}

exports.dragDropColumn=(req,res,next)=>{
      var columnCurrIndex = req.body.columnCurrIndex;
      var columnObj = req.body.columnObj;
      var targetIndex = req.body.targetIndex;
      jsonReader(__dirname + '/../dataset/sample-data.json', (err, jsonString) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                  message: err
              });
            }
            else {
                  //below add the header column to the drop index
                  if(parseInt(targetIndex) > parseInt(columnCurrIndex)) {
                        jsonString.treegrid.headers.splice(parseInt(targetIndex)+1, 0, columnObj);
                        //below removes the header column from current index
                        jsonString.treegrid.headers.splice(columnCurrIndex, 1);
                  }
                  else {
                        jsonString.treegrid.headers.splice(parseInt(targetIndex), 0, columnObj);
                        //below removes the header column from current index
                        jsonString.treegrid.headers.splice(parseInt(columnCurrIndex)+1, 1);
                  }
                  
                  fs.writeFile(__dirname + '/../dataset/sample-data.json', JSON.stringify(jsonString), (err) => {
                        if (err) {
                              console.log('Error writing file:', err)
                              res.status(500).json({
                                    message: err
                                });
                        }
                        else {
                             socket.broadcast.emit("TreeGrid data modified","CODE:x000SX1");
                              res.status(200).json({
                                    message: "success"
                              });
                        }
                    });
            }
      });
}

function deleteRowsForCutPaste(jsonString,id,res) {
      deleteRow(jsonString,id,res);
}

function addNewColumnWithData(jsonString,index,headerColumnObj,res) {
      traverseRootAndAllChild(jsonString.data,(i,obj,currArrayObj)=>{
            var newObject = addToObject(obj,headerColumnObj.name,headerColumnObj.defaultValue,index);
            currArrayObj[i] = newObject;
      });
      fs.writeFile(__dirname + '/../dataset/sample-data.json', JSON.stringify(jsonString), (err) => {
            if (err) {
                  console.log('Error writing file:', err)
                  res.status(500).json({
                        message: err
                  });
            }
            else {
                  socket.broadcast.emit("TreeGrid data modified","CODE:x000SX1");
                  res.status(200).json({
                        message: "success"
                  });
            }
      });
}

function updateNewColumnWithData(jsonString,index,headerColumnObj,oldHeaderObj,res) {
      traverseRootAndAllChild(jsonString.data,(i,obj,currArrayObj)=>{
            var colName = headerColumnObj.name;
            var oldName = oldHeaderObj.name;
            // console.log(headerColumnObj.defaultValue);
            if(obj.hasOwnProperty(oldName))
              obj[oldName] = convertDataToDataType(obj[oldName],headerColumnObj.dataType,
                        headerColumnObj.defaultValue);
            currArrayObj[i] = renameJsonObjectKey(obj,oldName,colName);
            
      });
      fs.writeFile(__dirname + '/../dataset/sample-data.json', JSON.stringify(jsonString), (err) => {
            if (err) {
                  console.log('Error writing file:', err)
                  res.status(500).json({
                        message: err
                  });
            }
            else {
                  //io.emit("TreeGrid data modified","CODE:x000SX1");
                  socket.broadcast.emit("TreeGrid data modified","CODE:x000SX1");
                  res.status(200).json({
                        message: "success"
                  });
            }
      });

}

function removeColumnWithData(jsonString,index,colName,res) {
      //below removes all the data columns
      traverseRootAndAllChild(jsonString.data,(i,obj,currArrayObj)=>{
            //obj.splice(index, 1);
            delete obj[colName];
      });
       fs.writeFile(__dirname + '/../dataset/sample-data.json', JSON.stringify(jsonString), (err) => {
             if (err) {
                   console.log('Error writing file:', err)
                   res.status(500).json({
                         message: err
                     });
             }
             else {
                  socket.broadcast.emit("TreeGrid data modified","CODE:x000SX1");
                   res.status(200).json({
                         message: "success"
                   });
             }
         });
}

function addRowNext(jsonString,selectedRowId,newRowObj,res) {
      getObjectById(jsonString.data,selectedRowId,(index,element,currArrayObj)=>{
            var currentKey = jsonString.key;
            newRowObj = Object.assign({TaskID: parseInt(currentKey)+1}, newRowObj);
            traverseObjectAndCheckDataIntegrityToDataType(newRowObj,jsonString.treegrid.headers);
            currArrayObj.splice(parseInt(index)+1,0,newRowObj);
            jsonString.key = parseInt(currentKey)+1;
            objFound = false;
      });
      fs.writeFile(__dirname + '/../dataset/sample-data.json', JSON.stringify(jsonString), (err) => {
            if (err) {
                  console.log('Error writing file:', err)
                  res.status(500).json({
                        message: err
                    });
            }
            else {
                 socket.broadcast.emit("TreeGrid data modified","CODE:x000SX1");
                  res.status(200).json({
                        message: "success"
                  });
            }
        });
      
}

function addRowChild(jsonString,selectedRowId,newRowObj,res) {
      getObjectById(jsonString.data,selectedRowId,(index,element,currArrayObj)=>{
            var currentKey = jsonString.key;
            newRowObj = Object.assign({TaskID: parseInt(currentKey)+1}, newRowObj);
            traverseObjectAndCheckDataIntegrityToDataType(newRowObj,jsonString.treegrid.headers);

            if(typeof(element.subtasks)!="undefined" && element.subtasks !=null 
            && element.subtasks!=''){
                  element.subtasks.push(newRowObj);
            } else {
                  element['subtasks'] = [];
                  element.subtasks.push(newRowObj);
            }
            currArrayObj[index]=element;
            jsonString.key = parseInt(currentKey)+1;
            objFound = false;
      });
      fs.writeFile(__dirname + '/../dataset/sample-data.json', JSON.stringify(jsonString), (err) => {
            if (err) {
                  console.log('Error writing file:', err)
                  res.status(500).json({
                        message: err
                    });
            }
            else {
                 socket.broadcast.emit("TreeGrid data modified","CODE:x000SX1");
                  res.status(200).json({
                        message: "success"
                  });
            }
        });
      
}

function deleteRow(jsonString,selectedRowId,res) {
      getObjectById(jsonString.data,selectedRowId,(index,element,currArrayObj)=>{
            currArrayObj.splice(index, 1);
            //console.log('in call back');
            objFound = false;
      });
      if(res !=null) {
            fs.writeFile(__dirname + '/../dataset/sample-data.json', JSON.stringify(jsonString), (err) => {
                  if (err) {
                        console.log('Error writing file:', err)
                        res.status(500).json({
                              message: err
                        });
                  }
                  else {
                  socket.broadcast.emit("TreeGrid data modified","CODE:x000SX1");
                        res.status(200).json({
                              message: "success"
                        });
                  }
            });
      }
}

function updateRow(jsonString,modifiedRowId,modifyRowObj,res) {
      return new Promise((resolve, reject) => {
            getObjectById(jsonString.data,modifiedRowId,(index,element,currArrayObj)=>{
                  modifyRowObj = Object.assign({TaskID: modifiedRowId}, modifyRowObj);
                  traverseObjectAndCheckDataIntegrityToDataType(modifyRowObj,jsonString.treegrid.headers);
                  currArrayObj[index] = modifyRowObj;
                  objFound = false;
            });
            resolve(true);
      });
      // fs.writeFile(__dirname + '/../dataset/sample-data.json', JSON.stringify(jsonString), (err) => {
      //       if (err) {
      //             console.log('Error writing file:', err)
      //             res.status(500).json({
      //                   message: err
      //               });
      //       }
      //       else {
      //            socket.broadcast.emit("TreeGrid data modified","CODE:x000SX1");
      //             res.status(200).json({
      //                   message: "success"
      //             });
      //       }
      //   });
}

function pasteRowNext(jsonString,selectedRowId,newRowObj,key,mode,res) {
      if(mode == 'cut') deleteRowsForCutPaste(jsonString,newRowObj.TaskID,null);
      getObjectById(jsonString.data,selectedRowId,(index,element,currArrayObj)=>{
            currArrayObj.splice(parseInt(index)+1,0,newRowObj);
            objFound = false;
      });
      jsonString.key=key;
}

function pasteRowChild(jsonString,selectedRowId,newRowObj,key,mode,res) {
      if(mode == 'cut') deleteRowsForCutPaste(jsonString,newRowObj.TaskID,null);
      getObjectById(jsonString.data,selectedRowId,(index,element,currArrayObj)=>{
            if(typeof(element.subtasks)!="undefined" && element.subtasks !=null 
            && element.subtasks!=''){
                  element.subtasks.push(newRowObj);
            } else {
                  element['subtasks'] = [];
                  element.subtasks.push(newRowObj);
            }
            currArrayObj[index]=element;
            objFound = false;
      });
      jsonString.key=key;
}

function pasteRowTop(jsonString,selectedRowId,newRowObj,key,mode,res) {
      if(mode == 'cut') deleteRowsForCutPaste(jsonString,newRowObj.TaskID,null);
      getObjectById(jsonString.data,String(selectedRowId).slice(),(index,element,currArrayObj)=>{
            currArrayObj.splice(parseInt(index),0,newRowObj);
            objFound=false;
      });
      jsonString.key=key;
}

// function visitDescendants(obj,callback) {
//       for(const[key,value] of Object.entries(obj)){
//             if(value && typeof(value) == "object") {
//                   visitDescendants(value,callback);
//             } else {
//                   callback(key,value);
//             }
//       }
// }

//below recursive function to traverse all the parent and child with a call back fxn
function traverseRootAndAllChild (obj,callback) {
      for(const[index,element] of Object.entries(obj)){
            if(typeof(element.subtasks)!="undefined" && element.subtasks !='' 
            && element.subtasks!=null && element.subtasks.length > 0) {
                  callback(index,element,obj);
                  traverseRootAndAllChild(element.subtasks,callback);
            } else {
                  callback(index,element,obj);
            }
      }
      
}

function findIndexToAppendDragAndDropRows (dataSet,dropIndex,dropIndexCounter,callback) {
      for(const[index,element] of Object.entries(dataSet)){
            if(objFound) break;
            if(typeof(element.subtasks)!="undefined" && element.subtasks !='' 
            && element.subtasks!=null && element.subtasks.length > 0) {
                  // var elemToDeleteIndex = dragDropEventObjData.findIndex((ele)=>ele.taskData.TaskID == element.TaskID);
                  // console.log(element.TaskID);
                  if(dropIndex == dropIndexCounter) {
                        objFound = true;
                        callback(index,element);
                        break;
                  }
                  else 
                  {
                        dropIndexCounter++;
                        findIndexToAppendDragAndDropRows(element.subtasks,dropIndex,dropIndexCounter,callback);
                  }
                  
            } else {
                  // var elemToDeleteIndex = dragDropEventObjData.findIndex((ele)=>ele.taskData.TaskID == element.TaskID);
                  // console.log(elemToDeleteIndex);
                  
                  if(dropIndex == dropIndexCounter) {
                        objFound = true;
                        callback(index,element);
                        break;
                  }
                  dropIndexCounter++;
            }
      }
      
}

function appendDragDropRowData(dragDropEventObjData, obj,objIndex,dropIndex,dataSet,dropPosition) {
      if(dropIndex !=0) {
            if(dropPosition == 'middleSegment') {
                  if(typeof(obj.subtasks)!="undefined" && obj.subtasks !='' 
                        && obj.subtasks!=null && obj.subtasks.length >= 0) {
                        for(const[index,element] of Object.entries(dragDropEventObjData)){
                              obj.subtasks.push(element.taskData);
                        }
                  } else {
                        var rowData = [];
                        for(const[index,element] of Object.entries(dragDropEventObjData)){
                              rowData.push(element.taskData);
                        }
                        obj.subtasks = rowData;
                  }
            } else if(dropPosition == 'topSegment') {
                  // var rowData = [];
                  for(const[index,element] of Object.entries(dragDropEventObjData)){
                        //rowData.push(element.taskData);
                        dataSet.splice(parseInt(objIndex)-1, 0, rowData);
                  }
                  // dataSet.splice(parseInt(objIndex)-1, 0, rowData);
            } else {
                  // var rowData = [];
                  for(const[index,element] of Object.entries(dragDropEventObjData)){
                        // rowData.push(element.taskData);
                        dataSet.splice(parseInt(objIndex), 0, rowData);
                  }
                  // dataSet.splice(parseInt(objIndex), 0, rowData);
            }
      } else {
            for(const[index,element] of Object.entries(dragDropEventObjData)){
                  dataSet.unshift(element.taskData);
            }
      }

      
}

function removeDragDropRowDataOnceMoved(dataSet,dragDropEventObjData) {
      var elemToDeleteIndex = 0;
      for(const[index,element] of Object.entries(dataSet)){
            elemToDeleteIndex = dragDropEventObjData.findIndex((ele)=>ele.taskData.TaskID == element.TaskID);
      }
}

function convertDataToDataType(data,dataType,defaultValue) {
      var safeValue = null;
      switch (dataType) {
            case 'Text' :
                  try {
                        safeValue = String(data);
                        if(typeof(safeValue)=='undefined' || safeValue == null || 
                        safeValue =='' || !isNaN(safeValue)) {
                              safeValue = defaultValue;
                        }
                        else safeValue = data;
                  } catch (e) {
                        safeValue = defaultValue;
                  }
                  break;
            case 'Num' :
                  try {
                        safeValue = parseFloat(data);
                        if(typeof(safeValue)=='undefined' || isNaN(safeValue)
                         || safeValue == null || safeValue =='') {
                              safeValue = defaultValue;
                        }
                        else safeValue = data;
                  } catch (e) {
                        safeValue = defaultValue;
                  }
                  break;
            case 'Date' :
                  try {
                        if(isDate(data)) {
                              safeValue = data;
                        }
                        else safeValue = defaultValue;
                  } catch (e) {
                        safeValue = defaultValue;
                  }
                  break; 
            case 'Boolean' :
                  // data = String(data);
                  // if(typeof(data)!='undefined' && data != null 
                  //       && data !='' && (data.toLowerCase() == 'true' || data.toLowerCase() == 'false')) {
                  //             safeValue = data;
                  // }
                  // else safeValue = defaultValue;

                  if(typeof(data) != "boolean") {
                              safeValue = defaultValue;
                        }
                        else safeValue = data;

                  break;
            default :
                  safeValue = defaultValue;    
      }
      return  safeValue;  
}

function renameJsonObjectKey(json,oldkey,newkey) {    
      var obj = Object.keys(json).reduce((s,item) => 
           item == oldkey ? ({...s,[newkey]:json[oldkey]}) : ({...s,[item]:json[item]}),{});
      // console.log(oldkey+'---'+newkey);
      // console.log(obj);
      return obj;  
}

function getObjectById(dataSet,id,callback) {
      //console.log(objFound+'--1');
      for(const[index,element] of Object.entries(dataSet)){
            if(objFound) break;
            if(typeof(element.subtasks)!="undefined" && element.subtasks !='' 
            && element.subtasks!=null && element.subtasks.length > 0) {
                  if(element.TaskID == id) {
                        objFound=true;
                        // console.log(objFound+'--2');
                        // console.log(element.TaskID +'--'+id+'---A');
                        callback(index,element,dataSet);
                  }
                  else {
                    getObjectById(element.subtasks,String(id).slice(),callback);
                  }

            } else {
                  if(element.TaskID == id) {
                        objFound=true;
                        // console.log(objFound+'--3');
                        // console.log(element.TaskID +'--'+id+'---B');
                        callback(index,element,dataSet);
                  }
            }
      }

      //Sample call below 
      // getObjectById(dataset,25,(index,element)=>{
      //       console.log(element);
      //       objFound = false;
      // });
}

function generateAndUpdateNewIds(dataSet,callback) {
      for(const[index,element] of Object.entries(dataSet)){
            counter ++;
            if(typeof(element.subtasks)!="undefined" && element.subtasks !='' 
            && element.subtasks!=null && element.subtasks.length > 0) {
                  element.TaskID = counter ;
                  callback(index,element,dataSet);
                  generateAndUpdateNewIds(element.subtasks,callback);
            } else {
                  //console.log('this key:'+key);
                  element.TaskID = counter ;
                  callback(index,element,dataSet);
            }
      }
}

function traverseObjectAndCheckDataIntegrityToDataType(obj,headers) {
      for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                  var headerObj = headers.find((o)=>o.name==prop);
                  if(typeof(headerObj)!="undefined" && headerObj!=null && headerObj !='') {
                        var val = convertDataToDataType(obj[prop],headerObj.dataType,headerObj.defaultValue);
                        obj[prop] = val;
                  }
            }
        }
}

function addFiftyThousandDummyRecords() {
      jsonReader(__dirname + '/../dataset/sample-data.json', (err, jsonString) => {
            if (err) {
                console.log(err)
                res.status(500).json({
                  message: err
              });
            }
            else {
                  for(var i=36;i<50000;i++) {
                        var obj = {
                              "TaskID":i,
                              "TaskName":"Planning",
                              "StartDate":"2017-02-02T18:30:00.000Z",
                              "EndDate":"2017-02-06T18:30:00.000Z",
                              "Progress":100,
                              "Duration":5,
                              "Priority":"Normal",
                              "approved":false,
                              "subtasks":[]
                        }
                        jsonString.data.splice(parseInt(i)+1,0,obj);
                  }
                  //console.log(jsonString);
                  fs.writeFile(__dirname + '/../dataset/sample-data.json', JSON.stringify(jsonString), (err) => {
                        if (err) {
                              console.log('Error writing file:', err);
                        }
                        else {
                              console.log('success')
                        }
                    });
            }
      });
}








