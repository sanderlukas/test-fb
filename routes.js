var sql = require('./sql');
var mssql = require('mssql')

exports.index = function(req, res) {
    res.send('<h1>Hello</h1>');
    }

exports.default = function(req, res) {
    res.status(404).send('Invalid route');
    }

exports.users = function(req, res) {
    var query = 
    'SELECT UserProfile.ID, FirstName, LastName, coverURL, PhotoURL, ISNULL(Bio, "") AS Bio, dbo.RelationshipStatus.Status,'
    + '(SELECT COUNT(FromFriendID) FROM dbo.Friendship WHERE ToFriendID = UserProfile.ID) AS Friends'
	+ 'FROM dbo.UserProfile'
	+ 'INNER JOIN dbo.RelationshipStatus ON dbo.UserProfile.RelationshipID = dbo.RelationshipStatus.ID'
	+ 'INNER JOIN dbo.Friendship f1 ON dbo.UserProfile.ID = f1.ToFriendID';

    if (typeof(req.params.id) !== 'undefined') {
        query = query.concat(' WHERE UserProfile.ID = ' + req.params.id);
    }

    var result = sql.querySql(query, function(data) {
        if (data !== undefined)
        {
            console.log('DATA rowsAffected: ' + data.rowsAffected);
            res.send(data.recordset);
        }
    }, function(err) {
        console.log('ERROR: ' + err);
        res.status(500).send('ERROR: ' + err);
        });
}

exports.feed = function(req, res) {
    var query = 'SELECT FirstName, LastName, dbo.Post.ID, Content, dbo.Post.[Date], Content,'
        + 'ISNULL((SELECT COUNT(dbo.Comment.ID) FROM dbo.Comment WHERE Comment.PostID = dbo.Post.ID), 0) AS Comments,'
        + 'ISNULL((SELECT COUNT(dbo.PostEmoji.EmojiID) FROM dbo.PostEmoji WHERE PostEmoji.PostID = dbo.Post.ID), 0) AS Emotions'
        + 'FROM dbo.UserProfile'
        + 'INNER JOIN dbo.Friendship ON dbo.UserProfile.ID = dbo.Friendship.FriendID'
        + 'INNER JOIN dbo.Post ON dbo.UserProfile.ID = dbo.Post.UserID'
        + 'INNER JOIN dbo.Comment ON dbo.Post.ID = dbo.Comment.PostID'
        + 'LEFT JOIN dbo.PostEmoji ON dbo.Post.ID = dbo.PostEmoji.PostID'
        + 'WHERE ToFriendID =' + req.params.id;

    var result = sql.querySql(query, function(data) {
        if (data !== undefined)
        {
            console.log('DATA rowsAffected: ' + data.rowsAffected);
            res.send(data.recordset);
        }
    }, function(err) {
        console.log('ERROR: ' + err);
        res.status(500).send('ERROR: ' + err);
        });
}

exports.groups = function(req, res) {
    var query = 'SELECT FacebookGroup.ID, FacebookGroup.GroupName, FacebookGroup.Description, COUNT(UserID) AS Members,'
	+ '(SELECT COUNT(UserID) FROM PeopleInGroups WHERE MONTH(Joined) = Month(SYSDATETIME()) AND Year(Joined) = Year(SYSDATETIME()) AND GroupID = FacebookGroup.ID) AS ThisMonth'
	+ 'FROM PeopleInGroups'
	+ 'LEFT JOIN FacebookGroup ON PeopleInGroups.GroupID = dbo.FacebookGroup.ID'
	+ 'LEFT JOIN FacebookGroup f2 ON PeopleInGroups.GroupID = f2.ID'
    + 'GROUP BY GroupID, FacebookGroup.ID, FacebookGroup.GroupName, FacebookGroup.Description'
    + 'ORDER BY Members DESC';

    var result = sql.querySql(query, function(data) {
        if (data !== undefined)
        {
            console.log('DATA rowsAffected: ' + data.rowsAffected);
            res.send(data.recordset);
        }
    }, function(err) {
        console.log('ERROR: ' + err);
        res.status(500).send('ERROR: ' + err);
        });
}

