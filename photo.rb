class Photo
  attr_accessor :name, :lat, :lng, :url_s, :url_sq, :username, :created_at

  def initialize(options)
    @id = options[:id]
    @name = options[:caption]
    @lat = options[:latitude]
    @lng = options[:longitude]
    @url_s = options[:url_s]
    @url_sq = options[:url_sq]
    @username = options[:username]
    @created_at = options[:created_at]
  end

  def self.from_instagram_photo(instagram_photo)
    self.new :id => instagram_photo.id, 
             :caption => (instagram_photo.caption ? instagram_photo.caption.text : ""),
             :latitude => instagram_photo.location.latitude,
             :longitude => instagram_photo.location.longitude,
             :url_s => instagram_photo.images.standard_resolution.url,
             :url_sq => instagram_photo.images.standard_resolution.url,
             :username => instagram_photo.user.full_name,
             :created_at => Time.at(instagram_photo.created_time.to_i).strftime("%I:%M%p %d %b %Y")
  end

  def to_json(*a)
    {
      :id => @id,
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
