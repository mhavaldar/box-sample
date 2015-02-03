var request = require('request');
var jwt = require('jwt-simple');
var config = require('./config.js');

module.exports = function (req, res) {
  ////Mock object for local testing. Comment this block for production
  ////<snippet>
  //res.json(dummyFolder);
  //return;
  ////</snippet>

  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'You are not authroized!'
    });
  }
  ;

  var token = req.headers.authorization.split(' ')[1];
  var payload = jwt.decode(token, config.JWT_SECRET);

  console.log('payload...');
  console.log(payload);

  if (!payload.access_token) {
    res.status(401).send({
      message: 'Authentication failed'
    });
  }

  var headers = {
    Authorization: 'Bearer ' + payload.access_token
  };

  var url = config.BOX_API_BASE_URL + 'folders/' + (req.params.id || '0') + '/items';

  console.log('boxURL:' + url);

  request.get({
    url: url, headers: headers, json: true
  }, function (err, response, folder) {
    if (err) throw err;

    console.log('Folder details')
    console.log(JSON.stringify(folder));
    res.json(folder);
  });
};

// dummy records
var dummyFolder = {
  "type": "folder",
  "id": "0",
  "sequence_id": null,
  "etag": null,
  "name": "All Files",
  "created_at": null,
  "modified_at": null,
  "description": "",
  "size": 1005929,
  "path_collection": {"total_count": 0, "entries": []},
  "created_by": {"type": "user", "id": "", "name": "", "login": ""},
  "modified_by": {"type": "user", "id": "231488413", "name": "Manju Havaldar", "login": "manju.havaldar@outlook.com"},
  "trashed_at": null,
  "purged_at": null,
  "content_created_at": null,
  "content_modified_at": null,
  "owned_by": {"type": "user", "id": "231488413", "name": "Manju Havaldar", "login": "manju.havaldar@outlook.com"},
  "shared_link": null,
  "folder_upload_email": null,
  "parent": null,
  "item_status": "active",
  "item_collection": {
    "total_count": 6,
    "entries": [
      {
        "type": "folder",
        "id": "3016225015",
        "sequence_id": "0",
        "etag": "0",
        "name": "test1"
      },
      {
        "type": "folder", "id": "3016227195", "sequence_id": "0", "etag": "0", "name": "test1user1"
      },
      {
        "type": "folder",
        "id": "3016227691",
        "sequence_id": "0",
        "etag": "0",
        "name": "test1user2"
      },
      {
        "type": "folder", "id": "3016225643", "sequence_id": "0", "etag": "0", "name": "test2"
      },
      {
        "type": "folder",
        "id": "3016226507",
        "sequence_id": "0",
        "etag": "0",
        "name": "testpublic"
      },
      {
        "type": "file",
        "id": "25517650361",
        "sequence_id": "1",
        "etag": "1",
        "sha1": "420f8ca512c50f9abd6ac07ef120a40b1cc04212",
        "name": "boxnote1.boxnote"
      }],
    "offset": 0,
    "limit": 100,
    "order": [{"by": "type", "direction": "ASC"}, {"by": "name", "direction": "ASC"}]
  }
}
