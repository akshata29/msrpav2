﻿using msrpaazure;
using Newtonsoft.Json;

namespace msrpawebapi
{
    public class SearchRequest
    {
        [JsonProperty("query")]
        public string Query { get; set; }
        [JsonProperty("searchFacets")]
        public SearchFacet[] SearchFacets { get; set; }
        [JsonProperty("currentPage")]
        public int CurrentPage { get; set; } = 1;
    }
}