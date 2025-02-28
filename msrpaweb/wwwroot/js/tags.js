﻿// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

function GetTagsHTML(result) {
    var tagsHTML = "";
    query = $('#q').val();

    tags.forEach(function (item, index, array) {
        var i = 0;    
        var name = item.key;
        var dedupedEntities = [];

        result[name].forEach(function (tagValue, i) {
            if (i <= 3) {
                if ($.inArray(tagValue, dedupedEntities) === -1) { //! in array
                    dedupedEntities.push(tagValue);
                    // create substring of tag name length if too long
                    if (tagValue.length > 30) {
                        tagValue = tagValue.substring(0, 27) + '...';
                    }
                    var tagClass = '';
                    if (query.toLowerCase().includes(tagValue.toLowerCase())) {
                        tagClass = 'tag-highlighted';
                    }
                    tagsHTML += `<div role="button" class="tag ${tagClass} tag-${name}" onclick="HighlightTag(event)"><span class="tag-text">${tagValue}</span></div>`;
                }
            }
            i++;
        });
    });

    return tagsHTML;
}

function HighlightTag(tag) {
    var searchText = $(event.target).text();

    if ($(event.target).parents('#tags-panel').length) {
        GetReferences(searchText, false);
    }
    else {
        event.stopPropagation();
        query = $('#q').val() + ` ${searchText}`;
        $('#q').val(query);
        Search();
    }
}

function GetReferences(searchText, allowMultiple) {
    var transcriptText;

    if (!allowMultiple) {
        $('#reference-viewer').html("");
        transcriptText = $('#transcript-viewer-pre').text();
    }
    else {
        transcriptText = $('#transcript-viewer-pre').html();
    }

    // find all matches in transcript
    var regex = new RegExp(searchText, 'gi');

    var i = -1;
    var response = transcriptText.replace(regex, function (str) {
        i++;
        var shortname = str.slice(0, 20).replace(/[^a-zA-Z ]/g, " ").replace(new RegExp(" ", 'g'), "_");
        return `<span id='${i}_${shortname}' class="highlight">${str}</span>`;
    })

    $('#transcript-viewer-pre').html(response);

    // for each match, select prev 50 and following 50 characters and add selections to list
    var transcriptCopy = transcriptText;

    // Calc height of reference viewer
    var contentHeight = $('.ms-Pivot-content').innerHeight();
    var tagViewerHeight = $('#tag-viewer').innerHeight();
    var detailsViewerHeight = $('#details-viewer').innerHeight();

    $('#reference-viewer').css("height", contentHeight - tagViewerHeight - detailsViewerHeight - 110)


    $.each(transcriptCopy.match(regex), function (index, value) {

        var startIdx;
        var ln = 400;

        if (value.length > 150) {
            startIdx = transcriptCopy.indexOf(value);
            ln = value.length;
        }
        else {
            if (transcriptCopy.indexOf(value) < 200) {
                startIdx = 0;
            }
            else {
                startIdx = transcriptCopy.indexOf(value) - 200;
            }

            ln = 400 + value.length;
        }

        var reference = transcriptCopy.substr(startIdx, ln);
        transcriptCopy = transcriptCopy.replace(value, "");

        reference = reference.replace(value, function (str) {
            return `<span class="highlight">${str}</span>`;
        });

        var shortName = value.slice(0, 20).replace(/[^a-zA-Z ]/g, " ").replace(new RegExp(" ", 'g'), "_");
        $('#reference-viewer').append(`<li class='reference list-group-item' onclick='GoToReference("${index}_${shortName}")'>...${reference}...</li>`);
    });
}

function GoToReference(selector) {
    // show transcript
    $('#file-pivot-link').removeClass('is-selected');
    $('#letters-pivot-link').removeClass('is-selected');
    $('#transcript-pivot-link').addClass('is-selected');

    $('#file-pivot').css('display', 'none');
    $('#letters-pivot').css('display', 'none');
    $('#transcript-pivot').css('display', 'block');

    var container = $('#transcript-viewer');
    var scrollTo = $("#" + selector);

    container.animate({
        scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
    });
}