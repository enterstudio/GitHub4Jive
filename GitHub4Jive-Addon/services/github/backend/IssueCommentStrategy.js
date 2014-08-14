/*
 * Copyright 2014 Jive Software
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

var jive = require("jive-sdk");
var gitHubFacade = require("../../../common/GitHubFacade");
var JiveContentBuilder = require("../../../common/JiveContentBuilder");
var helpers = require("./helpers");

var tokens = {};

exports.setup = function(setupOptions) {

    var jiveApi = setupOptions.jiveApi;
    var owner = setupOptions.owner;
    var repo = setupOptions.repo;
    var auth = {"type": "oauth", "token": setupOptions.gitHubToken};

    return gitHubFacade.subscribeToRepoEvent(owner, repo, gitHubFacade.Events.IssueComment, auth, function (gitData) {

        helpers.getDiscussionForIssue(jiveApi, gitData.issue.id).then(function (discussion) {
            var builder = new JiveContentBuilder();
            var comment = builder.message()
                .body(gitData.comment.body)
                .build();
            jiveApi.replyToDiscussion(discussion.contentID , comment).then(function (response) {
                if (!response.success) {
                    jive.logger.error("Error creating comment on " + discussion.subject);
                    jive.logger.error(response);
                }
            })
        }).catch(function (error) {
            jive.logger.error(error);
        });
    }).then(function (token) {
        tokens[setupOptions.placeUrl] = token;
    });

};

exports.teardown = function (teardownOptions) {
    var token = tokens[teardownOptions.placeUrl];
    return gitHubFacade.unSubscribeFromRepoEvent(token).then(function () {
        delete tokens[teardownOptions.placeUrl];
    });
};