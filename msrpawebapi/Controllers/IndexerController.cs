﻿using System.Threading.Tasks;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Mvc;
using msrpaazure;

namespace msrpawebapi
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class IndexerController : ControllerBase
    {
        private readonly AppInsightsConfig _appInsightsConfig;
        private readonly SearchConfig _searchConfig;
        private readonly BlobStorageConfig _storageConfig;
        private readonly SearchClient _searchClient;
        private readonly TelemetryClient _telemetryClient;

        public IndexerController(AppInsightsConfig appInsightsConfig, SearchConfig searchConfig, BlobStorageConfig storageConfig, TelemetryClient telemetryClient)
        {
            _appInsightsConfig = appInsightsConfig;
            _searchConfig = searchConfig;
            _storageConfig = storageConfig;
            _telemetryClient = telemetryClient;
            _telemetryClient.InstrumentationKey = _appInsightsConfig.InstrumentationKey;
            _searchClient = new SearchClient(_searchConfig, _telemetryClient);
        }
        
        [HttpPost]
        public async Task<IActionResult> UpdateIndexer(ResetIndexerRequest indexerRequest)
        {
            if (indexerRequest.Delete)
            {
                //DO nothing for now
                return new JsonResult("deleted");
            }

            if (indexerRequest.Reset)
            {
                await _searchClient.ResetIndexer();
            }

            if(indexerRequest.Run)
            {
                await _searchClient.RunIndexer();
            }

            return new JsonResult("success");
        }

        [HttpGet("indexerStatus")]
        public async Task<IActionResult> GetIndexerStatus()
        {
            var result = new JsonResult(await _searchClient.GetIndexerStatus());
            return result;
        }
    }
}