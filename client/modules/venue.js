class VenueModule {

    venue_info;

    constructor() {
        this.venue_info = {};
    }

    init() {
        this.loadVenueData();
    }

    async loadVenueData() {
        var data = await this.net_manager.pre_ready_request('/api/venue/get/all');
    }

}