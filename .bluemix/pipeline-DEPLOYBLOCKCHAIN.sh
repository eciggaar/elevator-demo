#!/usr/bin/env bash

set -ex

source .bluemix/pipeline-COMMON.sh
source .bluemix/pipeline-CLOUDANT.sh
source .bluemix/pipeline-BLOCKCHAIN.sh

provision_blockchain

