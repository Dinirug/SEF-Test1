using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [IgnoreAntiforgeryToken]
    public class GenericItemsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GenericItemsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/GenericItems?category=management
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? category)
        {
            var query = _context.GenericItems.AsQueryable();

            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(i => i.Category.ToLower() == category.Trim().ToLower());
            }

            var items = await query
                .OrderByDescending(i => i.UpdatedAt)
                .ToListAsync();

            return Ok(items);
        }

        // GET: api/GenericItems/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _context.GenericItems.FindAsync(id);
            if (item == null)
            {
                return NotFound(new { message = $"Item with ID {id} not found." });
            }

            return Ok(item);
        }

        // POST: api/GenericItems (Admin Only)
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateItemDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userName = User.FindFirstValue(ClaimTypes.Name) ?? "Admin";

            var newItem = new GenericItem
            {
                Category = dto.Category.Trim().ToLower(),
                Title = dto.Title.Trim(),
                Description = dto.Description.Trim(),
                Status = string.IsNullOrWhiteSpace(dto.Status) ? "Active" : dto.Status.Trim(),
                Amount = dto.Amount,
                CreatedBy = userName,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.GenericItems.Add(newItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = newItem.Id }, newItem);
        }

        // PUT: api/GenericItems/5 (Admin Only)
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateItemDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingItem = await _context.GenericItems.FindAsync(id);
            if (existingItem == null)
            {
                return NotFound(new { message = $"Item with ID {id} not found." });
            }

            existingItem.Title = dto.Title.Trim();
            existingItem.Description = dto.Description.Trim();
            existingItem.Status = string.IsNullOrWhiteSpace(dto.Status) ? "Active" : dto.Status.Trim();
            existingItem.Amount = dto.Amount;
            existingItem.UpdatedAt = DateTime.UtcNow;

            _context.GenericItems.Update(existingItem);
            await _context.SaveChangesAsync();

            return Ok(existingItem);
        }

        // DELETE: api/GenericItems/5 (Admin Only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingItem = await _context.GenericItems.FindAsync(id);
            if (existingItem == null)
            {
                return NotFound(new { message = $"Item with ID {id} not found." });
            }

            _context.GenericItems.Remove(existingItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Item '{existingItem.Title}' deleted successfully." });
        }
    }
}
