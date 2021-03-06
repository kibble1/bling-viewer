(function(presenters)
{
    function ActivityPresenter(Context)
    {
        this.interactor = Context.getActivityInteractor();
        this.networkInteractor = Context.getNetworkInteractor();
       
        this.activityView = Context.getActivityView(this);
        this.activityView.init();
    }

    Object.defineProperties(ActivityPresenter.prototype,
    {
        getCameras : {
            value: function()
            {
                var self = this;
                
                var cameras = [];
                
                this.networkInteractor.getNetworks(new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        var numNetworks = data.networks.length;
                        var i = 0;
                        
                        $.each( data.networks, function( key, value )
                        {
                            self.networkInteractor.getNetwork(value.network_id, new blink.listeners.BaseDecisionListener(
                            function(data)
                            {
                                i++;
                                
                                $.each( data.devicestatus, function( key, value )
                                {
                                    cameras.push(value);
                                });
                                
                                if(i >= numNetworks)
                                {
                                    self.activityView.onCameras(cameras);
                                }
                            },
                            function(data)
                            {
                                self.activityView.showError(data);
                            })); 
                        });
                    },
                    function(data)
                    {
                        self.activityView.showError(data);
                    }));
            },
            enumerable: false
        },
        getVideos : {
            value: function(page, callback)
            {
                var self = this;
                
                return this.interactor.getVideos(page, new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        callback(data, 500);
                    },
                    function(data)
                    {
                        self.activityView.showError(data);
                    }));
            },
            enumerable: false
        },
        getVideosCount : {
            value: function(callback)
            {
                var self = this;
                
                return this.interactor.getVideosCount(new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        callback(data);
                    },
                    function(data)
                    {
                        self.activityView.showError(data);
                    }));
            },
            enumerable: false
        },
        getMedia : {
            value: function(path, callback)
            {
                var self = this;
                    
                this.interactor.getMedia(path, new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        callback(data);
                    },
                    function(data)
                    {
                        self.activityView.showError(data);
                    }));
            },
            enumerable: false
        },
        downloadMedia : {
            value: function(path, callback)
            {
                var self = this;
                    
                this.interactor.downloadMedia(path, new blink.listeners.BaseDecisionListener(
                    function(data)
                    {
                        callback(data);
                    },
                    function(data)
                    {
                        self.activityView.showError(data);
                    }));
            },
            enumerable: false
        }
    });

    presenters.ActivityPresenter = ActivityPresenter;
})(blink.presenters);