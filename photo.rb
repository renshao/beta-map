class Photo
    attr_accessor :name, :lat, :lng

    def initialize(name, lat, lng, url)
        @name = name
        @lat = lat
        @lng = lng
        @url = url
        puts "New photo: #{name} => #{url}"
    end

    def to_json(*a)
        {
            :name => @name,
            :lat => @lat,
            :lng => @lng,
            :url => @url
        }.to_json(*a)
    end

    def to_s
        "#{name} (#{lat}, #{lng}) #{url}"
    end
end
