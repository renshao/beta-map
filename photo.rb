class Photo
    attr_accessor :name, :lat, :lng, :url_s, :url_sq

    def initialize(name, lat, lng, url_s, url_sq)
        @name = name
        @lat = lat
        @lng = lng
        @url_s = url_s
        @url_sq = url_sq
    end

    def to_json(*a)
        {
            :name => @name,
            :lat => @lat,
            :lng => @lng,
            :url_s => @url_s,
            :url_sq => @url_sq
        }.to_json(*a)
    end

    def to_s
        "#{name} (#{lat}, #{lng}) #{url_s} #{url_sq}"
    end
end
