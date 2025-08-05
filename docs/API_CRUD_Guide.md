# Hướng Dẫn Tạo API CRUD Mới

Tài liệu này hướng dẫn chi tiết cách tạo một bộ API CRUD (Create, Read, Update, Delete) hoàn chỉnh, tuân thủ theo kiến trúc đã được thiết lập của dự án (Model -> Repository -> Service -> Controller -> Route).

Chúng ta sẽ lấy một ví dụ cụ thể là tạo CRUD cho tài nguyên **"Product"**.

---

### **Bước 1: Tạo Database và Model**

Đây là lớp thấp nhất, tương tác trực tiếp với cơ sở dữ liệu.

1.  **Tạo Migration để định nghĩa cấu trúc bảng `products`:**

    Chạy lệnh sau trong terminal:
    ```bash
    php artisan make:migration create_products_table
    ```

    Mở file migration vừa được tạo trong `database/migrations/` và chỉnh sửa:

    ```php
    // database/migrations/xxxx_xx_xx_xxxxxx_create_products_table.php
    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;

    return new class extends Migration
    {
        public function up(): void
        {
            Schema::create('products', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->text('description')->nullable();
                $table->decimal('price', 8, 2);
                $table->integer('stock')->default(0);
                $table->string('status')->default('active'); // e.g., active, inactive
                $table->timestamps();
            });
        }

        public function down(): void
        {
            Schema::dropIfExists('products');
        }
    };
    ```

2.  **Tạo Model `Product`:**

    Chạy lệnh:
    ```bash
    php artisan make:model Product
    ```

    Mở file `app/Models/Product.php` và cấu hình các thuộc tính `fillable`, `searchable`, `filterable`, `sortable` để tương thích với `BaseQuery`:

    ```php
    // app/Models/Product.php
    <?php

    namespace App\Models;

    use Illuminate\Database\Eloquent\Factories\HasFactory;
    use Illuminate\Database\Eloquent\Model;

    class Product extends Model
    {
        use HasFactory;

        /**
         * Các trường có thể tìm kiếm.
         */
        public $searchable = ['name', 'description'];

        /**
         * Các trường có thể lọc (filter).
         */
        public $filterable = ['status', 'price'];

        /**
         * Các trường có thể sắp xếp (sort).
         */
        public $sortable = ['name', 'price', 'created_at'];

        /**
         * Các thuộc tính có thể được gán hàng loạt.
         */
        protected $fillable = [
            'name',
            'description',
            'price',
            'stock',
            'status',
        ];

        /**
         * Casts a value to a specified type.
         */
        protected $casts = [
            'price' => 'decimal:2',
        ];
    }
    ```

3.  **Chạy migration:**
    ```bash
    php artisan migrate
    ```

---

### **Bước 2: Tạo Lớp Repository**

Lớp này chịu trách nhiệm cho việc truy vấn dữ liệu từ database, tách biệt logic query ra khỏi model và service.

1.  **Tạo `ProductRepositoryInterface`:**

    ```php
    // app/Repositories/ProductRepositoryInterface.php
    <?php

    namespace App\Repositories;

    interface ProductRepositoryInterface extends BaseRepositoryInterface
    {
        // Nơi để định nghĩa các phương thức repository tùy chỉnh cho Product trong tương lai
    }
    ```

2.  **Tạo `ProductRepository` (triển khai Interface):**

    ```php
    // app/Repositories/Eloquent/ProductRepository.php
    <?php

    namespace App\Repositories\Eloquent;

    use App\Models\Product;
    use App\Repositories\ProductRepositoryInterface;

    class ProductRepository extends BaseRepository implements ProductRepositoryInterface
    {
        /**
         * @param Product $model
         */
        public function __construct(Product $model)
        {
            parent::__construct($model);
        }
    }
    ```

3.  **Đăng ký Repository vào Service Provider:**

    Mở file `app/Providers/RepositoryServiceProvider.php` và thêm binding cho `ProductRepository`.

    ```php
    // app/Providers/RepositoryServiceProvider.php
    namespace App\Providers;

    use Illuminate\Support\ServiceProvider;
    // ... các use statement khác
    use App\Repositories\ProductRepositoryInterface;
    use App\Repositories\Eloquent\ProductRepository;

    class RepositoryServiceProvider extends ServiceProvider
    {
        public function register(): void
        {
            // ... các binding khác
            $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class); // <-- Thêm dòng này
        }
        // ...
    }
    ```

---

### **Bước 3: Tạo Lớp Service**

Lớp này chứa business logic chính của ứng dụng.

1.  **Tạo `ProductService.php`:**

    ```php
    // app/Services/ProductService.php
    <?php

    namespace App\Services;

    use App\Models\Product;
    use App\Queries\BaseQuery;
    use App\Repositories\ProductRepositoryInterface;
    use Illuminate\Http\Request;
    use Illuminate\Pagination\LengthAwarePaginator;

    class ProductService
    {
        protected $productRepository;

        public function __construct(ProductRepositoryInterface $productRepository)
        {
            $this->productRepository = $productRepository;
        }

        public function getAllProducts(Request $request): LengthAwarePaginator
        {
            $query = $this->productRepository->getModel()->query();
            return BaseQuery::for($query, $request)->paginate();
        }

        public function getProductById(int $id): ?Product
        {
            return $this->productRepository->find($id);
        }

        public function createProduct(array $data): Product
        {
            return $this->productRepository->create($data);
        }

        public function updateProduct(Product $product, array $data): Product
        {
            $this->productRepository->update($product, $data);
            return $product->fresh();
        }

        public function deleteProduct(Product $product): bool
        {
            return $this->productRepository->delete($product);
        }
    }
    ```

---

### **Bước 4: Tạo Controller**

Controller là lớp giao tiếp với HTTP request, nhận dữ liệu, gọi service và trả về response.

1.  **Tạo `ProductController`:**
    ```bash
    php artisan make:controller Api/ProductController --api
    ```
2.  **Viết code cho Controller:**

    ```php
    // app/Http/Controllers/Api/ProductController.php
    <?php

    namespace App\Http\Controllers\Api;

    use App\Http\Controllers\Controller;
    use App\Models\Product;
    use App\Services\ProductService;
    use Dedoc\Scramble\Attributes\Group;
    use Illuminate\Http\Request;

    /**
     * @authenticated
     */
    #[Group('Products')]
    class ProductController extends Controller
    {
        protected $productService;

        public function __construct(ProductService $productService)
        {
            $this->productService = $productService;
        }

        /**
         * Lấy danh sách sản phẩm (có phân trang)
         * Hỗ trợ tìm kiếm, lọc, và sắp xếp.
         * @response \Illuminate\Pagination\LengthAwarePaginator<App\Models\Product>
         */
        public function index(Request $request)
        {
            $products = $this->productService->getAllProducts($request);
            return response()->json($products);
        }

        /**
         * Tạo sản phẩm mới
         * @response \App\Models\Product
         */
        public function store(Request $request)
        {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'status' => 'sometimes|string|in:active,inactive',
            ]);

            $product = $this->productService->createProduct($validated);
            return response()->json($product, 201);
        }

        /**
         * Lấy thông tin chi tiết một sản phẩm
         * @response \App\Models\Product
         */
        public function show(Product $product)
        {
            return response()->json($product);
        }

        /**
         * Cập nhật thông tin sản phẩm
         * @response \App\Models\Product
         */
        public function update(Request $request, Product $product)
        {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'price' => 'sometimes|numeric|min:0',
                'stock' => 'sometimes|integer|min:0',
                'status' => 'sometimes|string|in:active,inactive',
            ]);

            $updatedProduct = $this->productService->updateProduct($product, $validated);
            return response()->json($updatedProduct);
        }

        /**
         * Xóa một sản phẩm
         * @response 204
         */
        public function destroy(Product $product)
        {
            $this->productService->deleteProduct($product);
            return response()->json(null, 204);
        }
    }
    ```

---

### **Bước 5: Định nghĩa Route**

Cuối cùng, đăng ký các endpoints trong file `routes/api.php`.

1.  **Thêm `apiResource` route:**

    Mở file `routes/api.php` và thêm dòng sau:

    ```php
    // routes/api.php
    use App\Http\Controllers\Api\ProductController;

    // ... các route khác

    Route::middleware('auth:sanctum')->group(function () {
        // ... các route đã có
        Route::apiResource('products', ProductController::class);
    });
    ```
    Lệnh `Route::apiResource` sẽ tự động tạo ra các endpoints CRUD chuẩn:
    *   `GET /api/products` -> `index`
    *   `POST /api/products` -> `store`
    *   `GET /api/products/{product}` -> `show`
    *   `PUT/PATCH /api/products/{product}` -> `update`
    *   `DELETE /api/products/{product}` -> `destroy`

---

**Hoàn tất!** Bây giờ bạn đã có một bộ API CRUD đầy đủ cho `Product`. Các endpoints này sẽ tự động xuất hiện trong tài liệu API của bạn nếu bạn đang sử dụng Scramble. Bạn có thể dùng Postman hoặc công cụ tương tự để kiểm tra.
