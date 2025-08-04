require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module QrCustomerSystem
  class Application < Rails::Application
    config.load_defaults 7.1
    config.api_only = true
    
    # CORS configuration
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource '*',
          headers: :any,
          methods: [:get, :post, :put, :patch, :delete, :options, :head],
          expose: ['Authorization']
      end
    end
  end
end