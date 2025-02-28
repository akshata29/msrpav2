﻿using System.Collections.Generic;

namespace msrpaazure
{
    public class BlobStorageDirectory
    {
        public BlobStorageDirectory()
        {
            SubDirectories = new List<BlobStorageDirectory>();
            BlobNames = new List<string>();
        }

        public string Name { get; set; }
        public List<BlobStorageDirectory> SubDirectories { get; set; }
        public List<string> BlobNames { get; set; }
    }
}