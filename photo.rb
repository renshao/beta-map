class Photo
    attr_accessor :name, :lat, :lng, :url_s, :url_sq, :username, :created_at

    def initialize(name, lat, lng, url_s, url_sq, username, created_at)
        @name = name
        @lat = lat
        @lng = lng
        @url_s = url_s
        @url_sq = url_sq
        @username = username
        @created_at = created_at
    end

    def to_json(*a)
        {
            :name => @name,
            :lat => @lat,
            :lng => @lng,
            :url_s => @url_s,
            :url_sq => @url_sq,
            :username => @username,
            :created_at => @created_at
        }.to_json(*a)
    end

    def to_s
        "#{name} (#{lat}, #{lng}) #{url_s} #{url_sq} #{username} #{created_at}"
    end
end
