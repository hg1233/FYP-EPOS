class ClerksModule {

    net_manager;
    current_clerk;
    clerks;

    constructor() {
        this.current_clerk = null;
        this.net_manager = null;
        this.clerks = {};
    }

    init() {
        this.cacheClerks();
    }

    async cacheClerks() {
        var clerks = await this.net_manager.pre_ready_request('/api/clerks/get/all');
        // TODO - convert api data into local array (organised by PIN # maybe?)

        clerks.forEach(clerk => this.addClerkToLocalCache(clerk))
        console.log(`Loaded products (total: ${this.clerks.length}).`)
    }

    async addClerkToLocalCache(clerk) {
        try {
            this.validateClerkData(clerk);
            this.clerks[clerk.id] = clerk;
        } catch(err) {
            // dont add clerk if they fail validation
            return;
        }
    }

    validateClerkData() {
        // TODO
    }

    async findClerkByPIN(pin) {
        // TODO
    }
    
}

const instance = new ClerksModule();
module.exports = {instance};