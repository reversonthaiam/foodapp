class CheckoutsController < ApplicationController
  def create
    Stripe.api_key = Rails.configuration.stripe[:secret_key]

    unless params[:cart].present?
      return render json: { error: "Carrinho vazio" }, status: :bad_request
    end

    cart = params[:cart]
    line_items = cart.map do |item|
      product = Product.find(item["id"])
      product_stock = product.stocks.find { |ps| ps.size == item["size"] }

      if product_stock.amount < item["quantity"].to_i
        render json: { error: "Not enough stock #{product.name} in size #{item["size"]}. Only #{product_stock.amount} left." }, status: 400
        return
      end

      {
        quantity: item["quantity"].to_i,
        price_data: {
          product_data: {
            name: item["name"].force_encoding("UTF-8"),
            metadata: {
              product_id: product.id,
              size: item["size"].force_encoding("UTF-8"),
              product_stock_id: product_stock.id }
          },
          currency: "BRL",
          unit_amount: item["price"].to_i * 100
        }
      }
    end

    puts "line_items: #{line_items}"

    begin
      session = Stripe::Checkout::Session.create(
        mode: "payment",
        line_items: line_items,
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel"
      )

      render json: { url: session.url }

      rescue Stripe::StripeError => e
        render json: { error: "Stripe error: #{e.message}" }, status: :unprocessable_entity

      rescue StandardError => e
        Rails.logger.error("Unexpected error in checkout: #{e.message}")
        render json: { error: "Internal server error" }, status: :internal_server_error
      end

      def success
        render :success
      end

      def cancel
        render :cancel
      end
    end
end
