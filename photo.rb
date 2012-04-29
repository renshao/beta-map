class Photo
    attr_accessor :name, :lat, :lng

    def initialize(name, lat, lng)
        @name = name
        @lat = lat
        @lng = lng
    end

    def to_json(*a)
        {
            :name => @name,
            :lat => @lat,
            :lng => @lng
        }.to_json(*a)
    end

    def to_s
        "#{name} (#{lat}, #{lng})"
    end
end
