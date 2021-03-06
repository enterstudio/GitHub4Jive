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


var ACCORDION_ITEM_LENGTH_ERROR = exports.AccordionItemLengthError = "Accordion can only display 15 items";
var LIST_ITEM_LENGTH_ERROR  = exports.ListItemLengthError = "List can only display 10 items";
var ACTIVITY_HEADLINE_REQUIRED = exports.ActivityHeadlineMissing = "Activity headline required.";

/**
 * formats a string to fit a max length. Adds an ellipsis to beginning or end
 * @param {string} str the string to format
 * @param {integer} maxLength
 * @param {boolean} chopBeginning should the chop remove from the beginning of the string
 */
function chop(str, maxLength, chopBeginning){
    if(chopBeginning){
        return str.length > maxLength ? str.substr(0, maxLength-3) + "..." : str;
    }else{
        return str.length > maxLength ? "..." + str.slice(-1 * (maxLength -3)) : str;
    }
}


function formatAccordionEntry(item, keys){
    if(!keys){
        keys = {};
    }
    var textKey = keys["text"] || "text";
    var actionKey = keys["action"] || "action";
    var iconClass = keys["jiveIconClasses"] || "jiveIconClasses";
    var avatarKey = keys["avatar"] || "avatar";
    var byLineKey = keys["byline"] || "byline";
    return {
        text: chop(item[textKey] || item, 35, true),
        action: item[actionKey],
        jiveIconClasses: item[iconClass],
        avatar: item[avatarKey],
        byline: item[byLineKey]
    };
}

function formatListEntry(item, keys){
    if(!keys){
        keys = {};
    }
    var textKey = keys["text"] || "text";
    var actionKey = keys["action"] || "action";
    var iconKey = keys["icon"] || "icon";
    var avatarKey = keys["avatar"] || "avatar";
    var byLineKey = keys["byline"] || "byline";
    var userIDKey = keys["userID"] || "userID";
    var userIsPartnerKey = keys["userIsPartner"] || "userIsPartner";
    var containerIDKey = keys["containerID"] || "containerID";
    var containerTypeKey = keys["containerType"] || "containerType";
    var linkDescriptionKey = keys["linkDescription"] || "linkDescription";
    var linkMoreDescriptionKey = keys["linkMoreDescription"] || "linkMoreDescription";

    return {
        text: chop(item[textKey] || item, 35, true),
        action: item[actionKey],
        icon: item[iconKey],
        avatar: item[avatarKey],
        byline: item[byLineKey],
        userID: item[userIDKey],
        userIsPartner: item[userIsPartnerKey],
        containerID: item[containerIDKey],
        containerType: item[containerTypeKey],
        linkDescription: item[linkDescriptionKey],
        linkMoreDescription: item[linkMoreDescriptionKey]

    };
}

function formatTableEntry(item, keys) {
    if(!keys){
        keys = {};
    }
    var nameKey = keys.name || "name";
    var valueKey = keys.value || "value";
    var urlKey = keys.url || "url";
    return {
        name: chop(item[nameKey], 25),
        value: chop(item[valueKey], 50),
        url: item[urlKey]
    }
}

/**
 * return formatted tile data for an Accordion tile.
 * @param {string} title the header on the title
 * @param {[object]} items array of items that contain consistent data
 * @param {object} keys is a map to the particular member that in the item object
 * that should be used for the given tile data element
 * @return {object} formatted data object for accordion tile
 */
exports.formatAccordionData = function(title,items, keys){
    if(items.length > 15){
        throw Error(ACCORDION_ITEM_LENGTH_ERROR);
    }

    var formattedItems = items.map(function(item){return formatAccordionEntry(item, keys);});

    return  {
        title: chop(title, 50),
        items: formattedItems
    };
};


/**
 * return formatted tile data for an List tile.
 * @param {string} title the header on the title
 * @param {[object]} items array of items that contain consistent data
 * @param {object} keys is a map to the particular member that in the item object
 * that should be used for the given tile data element
 * @return {object} formatted data object for list tile
 */
exports.formatListData = function(title, items, keys){
    items = items ? items : [];
    if(items.length > 10){
        throw Error(LIST_ITEM_LENGTH_ERROR);
    }

    var formattedItems = items.map(function(item){ return formatListEntry(item, keys);});

    return {
        title: chop(title, 50),
        contents: formattedItems
    };
};

/**
 * format an empty list tile
 * @param {string} title of the tile
 * @param {string} message to display
 */
exports.emptyListData = function (title, message) {
    return {
        title: chop(title, 50),
        contents: [{text:message}],
        action: {
            text: 'Github' ,
            'url': 'https://www.github.com'
        }
    };
}

/**
 * return formatted tile data for an Table tile.
 * @param {string} title the header on the title
 * @param {[object]} items array of items that contain consistent data
 * @param {object} keys is a map to the particular member that in the item object
 * that should be used for the given tile data element
 * @return {object} formatted data object for table tile
 */
exports.formatTableData = function (title, items, keys) {
    var formattedItems = items.map(function (item) {
        return formatTableEntry(item, keys);
    })
    return {
        title: chop(title,50),
        contents: formattedItems
    }
};

/**
 * return formatted tile data for an Activity tile.
 * @param {string} headLine the main title of the activity entry
 * @param {string} description of the activity
 * @param {string} displayName of the person/user that is responsible for the data
 * @param {string} email of the person/user
 * @param {string} url for "go to item" link
 * @return {object} formatted data object for activity tile
 */
exports.formatActivityData = function (headLine, description, displayName, email, url) {
    if(!headLine || headLine == ""){
        throw Error(ACTIVITY_HEADLINE_REQUIRED);
    }
    return {
        "activity": {
            "action": {
                "name": "posted",
                "description": description
            },
            "actor": {
                "name": displayName,
                "email": email
            },
            "object": {
                "type": "website",
                "url": url,
                "image": "http://placehold.it/102x102",
                "title": headLine ,
                "description": description
            },
            "externalID": '' + new Date().getTime()
        }
    };
};
