/**
 * @author p0t4t0sandich
 * @description Game server manager utility class
 */

import { AMPAPIHandler } from "./AMPAPI.js";

/**
 * @class ServerManager
 * @description Game server manager utility class
 * @property {AMPAPIHandler} ampapi AMP API handler
 */
class ServerManager {
    private ampapi: AMPAPIHandler = new AMPAPIHandler(
        process.env.AMP_API_URL,
        process.env.AMP_API_USERNAME,
        process.env.AMP_API_PASSWORD
    );
}
