# Read-Only API Analysis Approach

## Overview
This document clarifies that the API Documentation and Inventory System performs **static code analysis only** - no services are executed, no servers are started, and no code is run.

## How It Works

### 1. Service Discovery (Read-Only)
```bash
# Simply list directories
ls -la | grep -E "(trunk|dev|main)$"
# Read package.json, pom.xml, etc. to identify service type
cat obk-parking-trunk/package.json | grep "name"
```

### 2. API Endpoint Detection Examples

#### For Express.js Services
```javascript
// Read route files like routes/api.js
// Look for patterns like:
router.get('/api/users/:id', ...)
router.post('/api/users', ...)
app.use('/v1', apiRouter)
```

#### For Spring Boot Services
```java
// Read controller files
// Look for annotations:
@RestController
@RequestMapping("/api/v1/products")
@GetMapping("/{id}")
@PostMapping
```

#### For FastAPI Services
```python
# Read Python files
# Look for decorators:
@app.get("/items/{item_id}")
@app.post("/items/")
```

### 3. Schema Extraction

#### From TypeScript
```typescript
// Read interface definitions
interface UserRequest {
  name: string;
  email: string;
  age?: number;
}
```

#### From Java
```java
// Read class definitions
public class ProductDTO {
    private String name;
    private BigDecimal price;
    @NotNull
    private String category;
}
```

### 4. Dependency Detection
```javascript
// Search for HTTP client usage
const axios = require('axios');
axios.get('https://external-api.com/data')

// Or fetch usage
fetch('http://another-service/api/users')
```

### 5. What We Generate (Without Execution)

For each service folder, we create:

**api-inventory.md**
```markdown
# Service: obk-parking-trunk

## Technology Stack
- Framework: Express.js 4.18.2
- Language: Node.js
- Database: MongoDB (detected from connection strings)

## API Endpoints

### GET /api/v1/parking/spots
- Description: Get all parking spots
- Parameters:
  - floor (query, optional): Filter by floor number
  - status (query, optional): Filter by availability
- Response: Array of ParkingSpot objects

### POST /api/v1/parking/reserve
- Description: Reserve a parking spot
- Body: ReservationRequest
  - spotId: string (required)
  - duration: number (required, minutes)
  - vehicleId: string (required)
- Response: ReservationConfirmation

## External Dependencies
- Google Maps API: Used for location services
- Payment Gateway API: https://payment.example.com
```

## Key Principles

1. **No Execution**: We NEVER run `npm start`, `java -jar`, `python app.py`, etc.
2. **File Reading Only**: We only read source files, configuration files, and documentation
3. **Pattern Matching**: We use regex and parsing to extract API information
4. **Static Analysis**: All information comes from analyzing code structure, not runtime behavior
5. **Safe Operation**: No risk of affecting running services or consuming resources

## Benefits

- **Safe**: No risk of breaking anything or consuming server resources
- **Fast**: Reading files is much faster than starting services
- **Complete**: Can analyze all 37+ services without memory/port conflicts
- **Reliable**: Consistent results every time, not affected by runtime issues 